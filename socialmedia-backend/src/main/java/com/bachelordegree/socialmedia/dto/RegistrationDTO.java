package com.bachelordegree.socialmedia.dto;

import lombok.Data;

@Data
public class RegistrationDTO {
    private String username;
    private String password;
    private String email;

    public String toString() {
        return "Registration info: username: " + this.username + " password: " + this.password + " email: " + this.email;
    }
}
