package CDWEB.watch.auth.dto;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {
    @NotBlank(message = "Họ không được để trống")
    @Size(min = 2, max = 50, message = "Họ phải từ 2 đến 50 ký tự")
    @Pattern(regexp = "^[A-Za-zÀ-Ỹà-ỹ\\s]+$", message = "Họ chỉ được chứa chữ cái và khoảng trắng")
    private String firstName;

    @NotBlank(message = "Tên không được để trống")
    @Size(min = 2, max = 50, message = "Tên phải từ 2 đến 50 ký tự")
    @Pattern(regexp = "^[A-Za-zÀ-Ỹà-ỹ\\s]+$", message = "Tên chỉ được chứa chữ cái và khoảng trắng")
    private String lastName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;


    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải ít nhất 8 ký tự")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Mật khẩu phải chứa cả chữ và số")
    private CharSequence password;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải nằm trong quá khứ")
    private LocalDate dateOfBirth;
}
