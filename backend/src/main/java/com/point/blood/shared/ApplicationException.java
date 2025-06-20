package com.point.blood.shared;

import org.slf4j.helpers.MessageFormatter;

import java.util.Objects;

public class ApplicationException extends RuntimeException {
    public ApplicationException(String message) {
        super(message);
    }

    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
    }

    private static String buildMessage(String message, Object[] argArray){
        if (!message.contains("{}") || Objects.isNull(argArray)){
            return message;
        } else {
            return MessageFormatter.arrayFormat(message, argArray).getMessage();
        }
    }

    public static ApplicationException createWithMessage(String message, Object... argArray){
        return new ApplicationException(buildMessage(message, argArray));
    }
}
