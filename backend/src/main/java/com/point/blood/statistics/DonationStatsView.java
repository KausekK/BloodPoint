package com.point.blood.statistics;

public interface DonationStatsView {
    String getBloodGroup();
    String getRh();
    String getGender();
    String getAgeBucket();
    Long getDonationsCnt();
}
