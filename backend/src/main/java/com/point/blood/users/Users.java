package com.point.blood.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.point.blood.donor.Donor;
import com.point.blood.role.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"donor", "roles"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

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

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 1)
    private Gender gender;


    @Pattern(regexp = "\\d{11}")
    @Column(name = "pesel", nullable = false, length = 11)
    private String pesel;

    @Email
    @NotBlank
    @Size(max = 255)
    @Column(name = "email", nullable = false)
    private String email;

    @Pattern(regexp = "^[0-9]{9}$")
    @Column(name = "phone", nullable = false, length = 9)
    private String phone;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @OneToOne(mappedBy = "users", cascade = CascadeType.ALL)
    private Donor donor;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "users_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Set<Role> roles = new HashSet<>();



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(r -> new SimpleGrantedAuthority(r.getName().name()))
                .collect(Collectors.toSet());
    }
    @Builder.Default
    @Column(name = "changed_password", nullable = false)
    private boolean changed_password = false;

    @Override
    @JsonIgnore
    public String getUsername() {
        return email;
    }

    @Override @JsonIgnore
    public boolean isAccountNonExpired() { return true; }

    @Override @JsonIgnore
    public boolean isAccountNonLocked() { return true; }

    @Override @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }

    @Override @JsonIgnore
    public boolean isEnabled() { return true; }



}
