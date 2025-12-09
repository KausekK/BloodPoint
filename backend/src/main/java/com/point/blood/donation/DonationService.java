package com.point.blood.donation;

import com.point.blood.appointment.Appointment;
import com.point.blood.appointment.AppointmentRepository;
import com.point.blood.bloodType.BloodType;
import com.point.blood.donationStatus.DonationStatusEnum;
import com.point.blood.donor.Donor;
import com.point.blood.questionnaire.response.QuestionnaireResponse;
import com.point.blood.questionnaire.response.QuestionnaireResponseRepository;
import com.point.blood.shared.ApplicationException;
import com.point.blood.shared.MessageDTO;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.donationStatus.DonationStatus;
import com.point.blood.donationStatus.DonationStatusRepository;
import com.point.blood.donationType.DonationType;
import com.point.blood.donationType.DonationTypeEnum;
import com.point.blood.donationType.DonationTypeRepository;
import com.point.blood.questionnaire.Questionnaire;
import com.point.blood.shared.EditResult;
import com.point.blood.stock.BloodStockRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.point.blood.appointment.AppointmentStatusEnum;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;
    private final AppointmentRepository appointmentRepository;
    private final DonationStatusRepository donationStatusRepository;
    private final DonationTypeRepository donationTypeRepository;
    private final BloodTypeRepository bloodTypeRepository;
    private final QuestionnaireResponseRepository questionnaireResponseRepository;
    private final BloodStockRepository bloodStockRepository;


    @PersistenceContext
    private EntityManager em;


    public List<DonationDTO> getUserDonations(Long userId, LocalDate dateFrom, LocalDate dateTo) {
        if (userId == null) {
            throw ApplicationException.createWithMessage("Brak identyfikatora użytkownika przy pobieraniu donacji.");
        }
        if (dateFrom == null && dateTo == null) {
            return donationRepository.findAllByDonorUserId(userId);
        }
        if (dateFrom == null || dateTo == null) {
            throw ApplicationException.createWithMessage("Zakres dat musi zawierać datę początkową i końcową.");
        }

        return donationRepository.findAllByDonorUserIdAndDate(
                userId,
                dateFrom.atStartOfDay(),
                dateTo.plusDays(1).atStartOfDay()
        );
    }

    public EditResult<NewDonationDTO> createDonationFromAppointment(Long appointmentId, NewDonationDTO dto) {
        if (appointmentId == null) {
            return buildError("Brak identyfikatora wizyty.");
        }
        if (dto == null) {
            return buildError("Brak danych donacji.");
        }
        if (dto.getDonationStatus() == null) {
            return buildError("Brak statusu donacji.");
        }
        var status = dto.getDonationStatus();

        if (status == DonationStatusEnum.ZREALIZOWANA) {
            if (dto.getAmountOfBlood() == null || dto.getAmountOfBlood().signum() <= 0) {
                return buildError("Ilość oddanej krwi musi być dodatnia dla zrealizowanej donacji.");
            }
        } else if (status == DonationStatusEnum.PRZERWANA) {
            if (dto.getAmountOfBlood() == null) {
                dto.setAmountOfBlood(java.math.BigDecimal.ZERO);
            } else if (dto.getAmountOfBlood().signum() < 0) {
                return buildError("Ilość oddanej krwi nie może być ujemna.");
            }
        } else {
            if (dto.getAmountOfBlood() == null) {
                dto.setAmountOfBlood(java.math.BigDecimal.ZERO);
            } else if (dto.getAmountOfBlood().signum() < 0) {
                return buildError("Ilość oddanej krwi nie może być ujemna.");
            }
        }

        var questionnaireResponseOpt =
                questionnaireResponseRepository.findByAppointmentId(appointmentId);

        if (questionnaireResponseOpt.isEmpty()) {
            return buildError("Dawca nie uzupełnił kwestionariusza dla tej wizyty.");
        }

        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono wizyty o id=" + appointmentId));

            var user = appointment.getUsers();
            var timeSlot = appointment.getDonationTimeSlot();
            var point = timeSlot.getBloodDonationPoint();

            DonationStatus donationStatus = donationStatusRepository
                    .findByStatus(dto.getDonationStatus())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Nieznany status donacji: " + dto.getDonationStatus()));

            DonationTypeEnum typeEnum = DonationTypeEnum.KREW_PELNA;

            DonationType donationType = donationTypeRepository
                    .findByType(typeEnum)
                    .orElseThrow(() -> new IllegalStateException(
                            "Brak typu donacji " + typeEnum + " w bazie."));

            LocalDateTime donationDate = timeSlot.getStartTime();

            Donor donor = user.getDonor();
            BloodType bloodTypeToUse;
            if (donor == null) {

                if (dto.getBloodTypeId() == null) {
                    return buildError("Brak grupy krwi dla pierwszej donacji.");
                }

                BloodType bloodType = bloodTypeRepository.findById(dto.getBloodTypeId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Nieznana grupa krwi o id=" + dto.getBloodTypeId()));

                donor = new Donor();
                donor.setUserId(user.getId());
                donor.setUsers(user);
                donor.setBloodType(bloodType);
                donor.setLastDonationDate(donationDate.toLocalDate());

                em.persist(donor);
                user.setDonor(donor);

                bloodTypeToUse = bloodType;
            } else {
                bloodTypeToUse = donor.getBloodType();
                donor.setLastDonationDate(donationDate.toLocalDate());
            }

            QuestionnaireResponse qrEntity = questionnaireResponseOpt.get();
            Questionnaire questionnaire = qrEntity.getQuestionnaire();


            Donation entity = new Donation();
            entity.setAmountOfBlood(dto.getAmountOfBlood());
            entity.setDonationDate(donationDate);
            entity.setDonationType(donationType);
            entity.setBloodDonationPoint(point);
            entity.setDonationStatus(donationStatus);
            entity.setQuestionnaire(questionnaire);
            entity.setDonor(donor);
            entity.setBloodType(bloodTypeToUse);

            Donation saved = donationRepository.saveAndFlush(entity);

            qrEntity.setDonation(saved);

            if (dto.getDonationStatus() != null) {
                switch (dto.getDonationStatus()) {
                    case ZREALIZOWANA -> appointment.setStatus(AppointmentStatusEnum.ZREALIZOWANA);
                    case PRZERWANA   -> appointment.setStatus(AppointmentStatusEnum.PRZERWANA);
                }
                appointmentRepository.save(appointment);
            }

            if (dto.getDonationStatus() == com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA) {
                Long pointId = point.getId();
                Long bloodTypeId = bloodTypeToUse.getId();

                var stock = bloodStockRepository.findForUpdate(pointId, bloodTypeId)
                        .orElseThrow(() -> new IllegalStateException(
                                "W magazynie punktu brak pozycji dla tej grupy krwi."));

                stock.setAvailableQuantity(
                        stock.getAvailableQuantity().add(dto.getAmountOfBlood())
                );

                bloodStockRepository.save(stock);
            }

            NewDonationDTO resultDto = new NewDonationDTO();
            resultDto.setBloodTypeId(saved.getBloodType().getId());
            resultDto.setDonationStatus(saved.getDonationStatus().getStatus());
            resultDto.setAmountOfBlood(saved.getAmountOfBlood());
            resultDto.setDonationDate(saved.getDonationDate());
            resultDto.setDonationType(saved.getDonationType().getType());
            resultDto.setQuestionnaireId(saved.getQuestionnaire().getId());

            return EditResult.<NewDonationDTO>builder()
                    .resultDTO(resultDto)
                    .messages(List.of(MessageDTO.createSuccessMessage("Donacja została zapisana.")))
                    .build();

        } catch (IllegalArgumentException | IllegalStateException e) {
            return buildError(e.getMessage());
        }
    }

    private EditResult<NewDonationDTO> buildError(String msg) {
        return EditResult.<NewDonationDTO>builder()
                .messages(List.of(MessageDTO.createErrorMessage(msg)))
                .build();
    }


}
