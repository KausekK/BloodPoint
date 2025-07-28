package com.point.blood.donationPoint.menageStaff;

import com.point.blood.donationPoint.BloodDonationPoint;
import com.point.blood.shared.EntityMapper;
import com.point.blood.users.Users;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper implements EntityMapper<StaffDTO, Staff> {

    @Override
    public Staff toEntity(StaffDTO dto) {
        return Staff.builder()
                .id(dto.getUserId())
                .user(Users.builder().id(dto.getUserId()).build())
                .employmentStartDay(dto.getEmploymentStartDay())
                .position(dto.getPosition())
                .bloodDonationPoint(BloodDonationPoint.builder()
                        .id(dto.getDonationPointId())
                        .build())
                .build();
    }

    @Override
    public StaffDTO toDto(Staff entity) {
        return new StaffDTO(
                entity.getId(),
                entity.getUser().getFirstName(),
                entity.getUser().getLastName(),
                entity.getUser().getEmail(),
                entity.getUser().getPesel(),
                entity.getEmploymentStartDay(),
                entity.getPosition(),
                entity.getBloodDonationPoint().getId()
        );
    }
}
