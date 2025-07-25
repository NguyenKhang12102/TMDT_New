package CDWEB.watch.auth.repositories;

import CDWEB.watch.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDetailRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    List<User> findByEnabledFalse();
}
