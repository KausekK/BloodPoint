package com.point.blood.shared;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.validator.constraints.Length;

@Builder
@Data
@Jacksonized
public class MessageDTO {

    @NotNull
    @Length(max = 1000)
    private String msg;
    private MessageTypeEnum type;

    public static MessageDTO createErrorMessage(String msg) {
        return createMessage(msg, MessageTypeEnum.ERROR);
    }

    public static MessageDTO createSuccessMessage(String msg) {
        return createMessage(msg, MessageTypeEnum.SUCCESS);
    }

    public static MessageDTO createInfoMessage(String msg) {
        return createMessage(msg, MessageTypeEnum.INFO);
    }

    private static MessageDTO createMessage(String msg, MessageTypeEnum type) {
        return MessageDTO.builder().msg(msg).type(type).build();
    }


}
