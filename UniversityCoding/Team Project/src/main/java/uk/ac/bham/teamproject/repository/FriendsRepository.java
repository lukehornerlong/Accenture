package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Friends;

/**
 * Spring Data JPA repository for the Friends entity.
 */
@Repository
public interface FriendsRepository extends JpaRepository<Friends, Long> {
    @Query("select friends from Friends friends where friends.user_id1.login = ?#{principal.username}")
    List<Friends> findByUser_id1IsCurrentUser();

    @Query("select friends from Friends friends where friends.user_id2.login = ?#{principal.username}")
    List<Friends> findByUser_id2IsCurrentUser();

    default Optional<Friends> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Friends> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Friends> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct friends from Friends friends left join fetch friends.user_id1 left join fetch friends.user_id2",
        countQuery = "select count(distinct friends) from Friends friends"
    )
    Page<Friends> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct friends from Friends friends left join fetch friends.user_id1 left join fetch friends.user_id2")
    List<Friends> findAllWithToOneRelationships();

    @Query("select friends from Friends friends left join fetch friends.user_id1 left join fetch friends.user_id2 where friends.id =:id")
    Optional<Friends> findOneWithToOneRelationships(@Param("id") Long id);
}
