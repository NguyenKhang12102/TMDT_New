package CDWEB.watch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {

    @NotBlank(message = "Vui lòng nhập tên người nhận")
    private String name;

    @NotBlank(message = "Vui lòng nhập địa chỉ")
    @Size(min = 5, message = "Địa chỉ phải có ít nhất 5 ký tự")
    private String street;

    @NotBlank(message = "Vui lòng nhập tỉnh/thành phố")
    private String city;

    @NotBlank(message = "Vui lòng nhập khu vực/quận/huyện")
    private String state;

    @Size(min = 5, max = 10, message = "Mã bưu điện phải có từ 5 đến 10 ký tự")
    private String zipCode;

    @NotBlank(message = "Vui lòng nhập số điện thoại")
    @Pattern(
            regexp = "^(0|\\+84)[0-9]{9,10}$",
            message = "Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84, 10–11 số)"
    )
    private String phoneNumber;
}
