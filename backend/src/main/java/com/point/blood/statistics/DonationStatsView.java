package com.point.blood.statistics;

public interface DonationStatsView {
    String getBloodGroup();
    String getRhFactor();
    String getGender();
    String getAgeBucket();
    Long getDonationsCnt();
}
