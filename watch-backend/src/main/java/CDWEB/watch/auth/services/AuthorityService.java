    package CDWEB.watch.auth.services;


    import CDWEB.watch.auth.entities.Authority;
    import CDWEB.watch.auth.repositories.AuthorityRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

    import java.util.ArrayList;
    import java.util.List;

    @Service
    public class AuthorityService {

        @Autowired
        private AuthorityRepository authorityRepository;

        public List<Authority> getUserAuthority(){
            List<Authority> authorities=new ArrayList<>();
            Authority authority= authorityRepository.findByRoleCode("USER");
//            if (authority == null) {
//                authority = createAuthority("USER", "Người mua hàng");
//            }

            authorities.add(authority);
            return  authorities;
        }

        public Authority createAuthority(String role, String description){
            Authority authority= Authority.builder().roleCode(role).roleDescription(description).build();
            return authorityRepository.save(authority);
        }
    }