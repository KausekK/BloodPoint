package com.point.blood.shared;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.jackson.Jacksonized;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@RequiredArgsConstructor
@Jacksonized
public class EditResult <T> {

    @Builder.Default
    private final List<MessageDTO> messages = new ArrayList<>();
    private final T resultDTO;

    public boolean hasErrors(){
        return messages.stream().anyMatch(messageDTO -> MessageTypeEnum.ERROR.equals(messageDTO.getType()));
    }

}
