package com.point.blood.users;

import com.point.blood.donor.Donor;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table
@ToString(exclude = "donor")
@EqualsAndHashCode(exclude = "donor")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(name = "login", nullable = false)
    private String login;

    @NotBlank
    @Size(max = 255)
    @Column(name = "password", nullable = false)
    private String password;

    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @NotBlank
    @Size(max = 255)
    @Column(name = "last_name", nullable = false)
    private String lastName;
//TODO
//    @Pattern(regexp = "[MK]")
//    @Column(name = "gender", nullable = false, length = 1)
//    private String gender;

    @Pattern(regexp = "\\d{11}")
    @Column(name = "pesel", nullable = false, length = 11)
    private String pesel;

    @Email
    @NotBlank
    @Size(max = 255)
    @Column(name = "email", nullable = false)
    private String email;
//TODO
//    @Pattern(regexp = "^[0-9]{9}$")
//    @Column(name = "phone", nullable = false, length = 9)
//    private String phone;

//    @Column(name = "date_of_birth", nullable = false)
//    private LocalDate dateOfBirth;

    @OneToOne(mappedBy = "users", cascade = CascadeType.ALL)
    private Donor donor;

    //TODO dodac role
}
