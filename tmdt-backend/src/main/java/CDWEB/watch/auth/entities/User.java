package CDWEB.watch.auth.entities;

import CDWEB.watch.entity.Address;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Table(name = "AUTH_USER_DETAILS")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private UUID id;

    private String firstName;

    private String lastName;

    @JsonIgnore
    private String password;

    private Date createdOn;

    private Date updatedOn;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    private String provider;

    private String verificationCode;

    private boolean enabled = false;

    private LocalDateTime verificationCodeCreatedAt;

    @Column(name = "point", nullable = false)
    private Integer point = 0;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(name = "AUTH_USER_AUTHORITY", joinColumns = @JoinColumn(referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(referencedColumnName = "id"))
    private List<Authority> authorities;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Address> addressList;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {

        return this.email;
    }

}