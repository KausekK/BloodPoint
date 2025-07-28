package com.point.blood.appointment.holidays;


import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class HolidayService {
//TODO dopisac do dokumentacji ze korzystamy z zewnetrznego API
    private final WebClient webClient;
    private final Set<LocalDate> holidays = ConcurrentHashMap.newKeySet();

    public HolidayService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://date.nager.at/api/v3").build();
    }

    @PostConstruct
    void init() {
        int thisYear = LocalDate.now().getYear();
        refresh(thisYear);
        refresh(thisYear + 1);
    }

    public boolean isHoliday(LocalDate date) {
        if (holidays.stream().noneMatch(d -> d.getYear() == date.getYear())) {
            refresh(date.getYear());
        }
        return holidays.contains(date);
    }

    public Set<LocalDate> getHolidaysForYear(int year) {
        if (holidays.stream().noneMatch(d -> d.getYear() == year)) {
            refresh(year);
        }
        return holidays.stream()
                .filter(d -> d.getYear() == year)
                .collect(Collectors.toSet());
    }

    public Set<LocalDate> all() {
        return Set.copyOf(holidays);
    }

    private void refresh(int year) {
        var list = webClient.get()
                .uri("/PublicHolidays/{year}/PL", year)
                .retrieve()
                .bodyToFlux(PublicHolidayDTO.class)
                .collectList()
                .onErrorReturn(List.of())
                .block();
        if (list != null) {
            holidays.addAll(list.stream().map(PublicHolidayDTO::getDate).toList());
        }
    }
}
