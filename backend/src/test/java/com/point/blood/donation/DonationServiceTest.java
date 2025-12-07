package com.point.blood.donation;

import com.point.blood.appointment.Appointment;
import com.point.blood.appointment.AppointmentRepository;
import com.point.blood.appointment.AppointmentStatusEnum;
import com.point.blood.bloodType.BloodType;
import com.point.blood.bloodType.BloodTypeRepository;
import com.point.blood.donationStatus.DonationStatus;
import com.point.blood.donationStatus.DonationStatusEnum;
import com.point.blood.donationStatus.DonationStatusRepository;
import com.point.blood.donationType.DonationType;
import com.point.blood.donationType.DonationTypeEnum;
import com.point.blood.donationType.DonationTypeRepository;
import com.point.blood.donor.Donor;
import com.point.blood.questionnaire.Questionnaire;
import com.point.blood.questionnaire.response.QuestionnaireResponse;
import com.point.blood.questionnaire.response.QuestionnaireResponseRepository;
import com.point.blood.shared.ApplicationException;
import com.point.blood.stock.BloodPointBloodTyp;
import com.point.blood.stock.BloodStockRepository;
import com.point.blood.users.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DonationStatusRepository donationStatusRepository;

    @Mock
    private DonationTypeRepository donationTypeRepository;

    @Mock
    private BloodTypeRepository bloodTypeRepository;

    @Mock
    private QuestionnaireResponseRepository questionnaireResponseRepository;

    @Mock
    private BloodStockRepository bloodStockRepository;

    private DonationService service;

    @Captor
    private ArgumentCaptor<Donation> donationCaptor;

    @BeforeEach
    void setUp() {
        service = new DonationService(donationRepository, appointmentRepository, donationStatusRepository,
                donationTypeRepository, bloodTypeRepository, questionnaireResponseRepository, bloodStockRepository);
    }

    @Test
    void getUserDonations_nullUser_throws() {
        assertThatThrownBy(() -> service.getUserDonations(null, null, null))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Brak identyfikatora użytkownika przy pobieraniu donacji.");
    }

    @Test
    void getUserDonations_noDates_delegatesToRepo() {
        when(donationRepository.findAllByDonorUserId(5L)).thenReturn(List.of());
        var res = service.getUserDonations(5L, null, null);
        assertThat(res).isEmpty();
        verify(donationRepository).findAllByDonorUserId(5L);
    }

    @Test
    void getUserDonations_oneDateNull_throws() {
        assertThatThrownBy(() -> service.getUserDonations(1L, LocalDate.now(), null))
                .isInstanceOf(ApplicationException.class)
                .hasMessageContaining("Zakres dat musi zawierać datę początkową i końcową.");
    }

    @Test
    void createDonationFromAppointment_nullAppointmentId_returnsError() {
        var res = service.createDonationFromAppointment(null, new NewDonationDTO());
        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages().getFirst().getMsg()).contains("Brak identyfikatora wizyty.");
    }

    @Test
    void createDonationFromAppointment_missingQuestionnaire_returnsError() {
        Long apptId = 10L;
        NewDonationDTO dto = new NewDonationDTO();
        dto.setDonationStatus(com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA);
        dto.setAmountOfBlood(new BigDecimal("0.5"));

        when(questionnaireResponseRepository.findByAppointmentId(apptId)).thenReturn(Optional.empty());

        var res = service.createDonationFromAppointment(apptId, dto);
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages().getFirst().getMsg()).contains("Dawca nie uzupełnił kwestionariusza");
    }

    @Test
    void createDonationFromAppointment_donorNull_missingBloodType_returnsError() {
        Long apptId = 11L;
        NewDonationDTO dto = new NewDonationDTO();
        dto.setDonationStatus(com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA);
        dto.setAmountOfBlood(new BigDecimal("0.5"));
        dto.setBloodTypeId(null);

        QuestionnaireResponse qr = QuestionnaireResponse.builder().id(2L).questionnaire(Questionnaire.builder().id(3L).build()).build();
        when(questionnaireResponseRepository.findByAppointmentId(apptId)).thenReturn(Optional.of(qr));

        Users user = Users.builder().id(7L).build();
        var point = com.point.blood.donationPoint.BloodDonationPoint.builder().id(21L).build();
        var timeSlot = com.point.blood.donationTimeSlot.DonationTimeSlot.builder().startTime(LocalDateTime.now()).bloodDonationPoint(point).build();
        Appointment appt = Appointment.builder().id(apptId).users(user).donationTimeSlot(timeSlot).build();
        when(appointmentRepository.findById(apptId)).thenReturn(Optional.of(appt));

        DonationStatus ds = DonationStatus.builder().id(1L).status(com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA).build();
        when(donationStatusRepository.findByStatus(com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA)).thenReturn(Optional.of(ds));
        DonationType dt = DonationType.builder().id(1L).type(DonationTypeEnum.KREW_PELNA).build();
        when(donationTypeRepository.findByType(DonationTypeEnum.KREW_PELNA)).thenReturn(Optional.of(dt));

        var res = service.createDonationFromAppointment(apptId, dto);
        assertThat(res.hasErrors()).isTrue();
        assertThat(res.getMessages().get(0).getMsg()).contains("Brak grupy krwi dla pierwszej donacji.");
    }

    @Test
    void createDonationFromAppointment_success_existingDonor_updatesStockAndReturnsDto() {
        Long apptId = 20L;
        NewDonationDTO dto = new NewDonationDTO();
        dto.setDonationStatus(com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA);
        dto.setAmountOfBlood(new BigDecimal("1.0"));

        Questionnaire questionnaire = Questionnaire.builder().id(5L).build();
        QuestionnaireResponse qr = QuestionnaireResponse.builder().id(6L).questionnaire(questionnaire).build();
        when(questionnaireResponseRepository.findByAppointmentId(apptId)).thenReturn(Optional.of(qr));

        BloodType bt = BloodType.builder().id(2L).bloodGroup("A").rhFactor('+').build();
        Donor donor = Donor.builder().userId(9L).bloodType(bt).build();
        Users user = Users.builder().id(9L).donor(donor).build();

        var point = com.point.blood.donationPoint.BloodDonationPoint.builder().id(30L).build();
        var timeSlot = com.point.blood.donationTimeSlot.DonationTimeSlot.builder().startTime(LocalDateTime.now()).bloodDonationPoint(point).build();

        Appointment appt = Appointment.builder().id(apptId).users(user).donationTimeSlot(timeSlot).build();
        when(appointmentRepository.findById(apptId)).thenReturn(Optional.of(appt));

        DonationStatus ds = DonationStatus.builder().id(1L).status(DonationStatusEnum.ZREALIZOWANA).build();
        when(donationStatusRepository.findByStatus(com.point.blood.donationStatus.DonationStatusEnum.ZREALIZOWANA)).thenReturn(Optional.of(ds));

        DonationType dt = DonationType.builder().id(10L).type(DonationTypeEnum.KREW_PELNA).build();
        when(donationTypeRepository.findByType(DonationTypeEnum.KREW_PELNA)).thenReturn(Optional.of(dt));

        Donation saved = Donation.builder().id(77L).amountOfBlood(dto.getAmountOfBlood()).donationDate(timeSlot.getStartTime()).donationType(dt).bloodDonationPoint(point).donationStatus(ds).questionnaire(questionnaire).donor(donor).bloodType(bt).build();
        when(donationRepository.saveAndFlush(any())).thenReturn(saved);

        BloodPointBloodTyp stock = BloodPointBloodTyp.builder().id(40L).availableQuantity(new BigDecimal("0.0")).reservedQuantity(new BigDecimal("0.0")).donationPoint(point).bloodType(bt).build();
        when(bloodStockRepository.findForUpdate(point.getId(), bt.getId())).thenReturn(Optional.of(stock));
        when(bloodStockRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var res = service.createDonationFromAppointment(apptId, dto);

        assertThat(res).isNotNull();
        assertThat(res.hasErrors()).isFalse();
        assertThat(res.getResultDTO()).isNotNull();
        assertThat(res.getResultDTO().getBloodTypeId()).isEqualTo(bt.getId());
        assertThat(res.getResultDTO().getAmountOfBlood()).isEqualByComparingTo(dto.getAmountOfBlood());
        assertThat(qr.getDonation()).isEqualTo(saved);
        assertThat(stock.getAvailableQuantity()).isEqualByComparingTo(new BigDecimal("1.0"));

        verify(appointmentRepository).save(any());
        verify(bloodStockRepository).save(stock);
    }

}
