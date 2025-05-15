package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Friends.
 */
@Entity
@Table(name = "friends")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Friends implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @ManyToOne
    private User user_id1;

    @ManyToOne
    private User user_id2;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Friends id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser_id1() {
        return this.user_id1;
    }

    public void setUser_id1(User user) {
        this.user_id1 = user;
    }

    public Friends user_id1(User user) {
        this.setUser_id1(user);
        return this;
    }

    public User getUser_id2() {
        return this.user_id2;
    }

    public void setUser_id2(User user) {
        this.user_id2 = user;
    }

    public Friends user_id2(User user) {
        this.setUser_id2(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Friends)) {
            return false;
        }
        return id != null && id.equals(((Friends) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Friends{" +
            "id=" + getId() +
            "}";
    }
}
