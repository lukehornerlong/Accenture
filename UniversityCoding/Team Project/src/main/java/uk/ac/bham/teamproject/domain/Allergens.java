package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Allergens.
 */
@Entity
@Table(name = "allergens")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Allergens implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "celery")
    private Boolean celery;

    @Column(name = "gluten")
    private Boolean gluten;

    @Column(name = "crustaceans")
    private Boolean crustaceans;

    @Column(name = "egg")
    private Boolean egg;

    @Column(name = "fish")
    private Boolean fish;

    @Column(name = "lupin")
    private Boolean lupin;

    @Column(name = "milk")
    private Boolean milk;

    @Column(name = "molluscs")
    private Boolean molluscs;

    @Column(name = "mustard")
    private Boolean mustard;

    @Column(name = "nuts")
    private Boolean nuts;

    @Column(name = "peanuts")
    private Boolean peanuts;

    @Column(name = "sesame")
    private Boolean sesame;

    @Column(name = "soya")
    private Boolean soya;

    @Column(name = "sulphur")
    private Boolean sulphur;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "user", "dietaryTags" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Post post;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Allergens id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getCelery() {
        return this.celery;
    }

    public Allergens celery(Boolean celery) {
        this.setCelery(celery);
        return this;
    }

    public void setCelery(Boolean celery) {
        this.celery = celery;
    }

    public Boolean getGluten() {
        return this.gluten;
    }

    public Allergens gluten(Boolean gluten) {
        this.setGluten(gluten);
        return this;
    }

    public void setGluten(Boolean gluten) {
        this.gluten = gluten;
    }

    public Boolean getCrustaceans() {
        return this.crustaceans;
    }

    public Allergens crustaceans(Boolean crustaceans) {
        this.setCrustaceans(crustaceans);
        return this;
    }

    public void setCrustaceans(Boolean crustaceans) {
        this.crustaceans = crustaceans;
    }

    public Boolean getEgg() {
        return this.egg;
    }

    public Allergens egg(Boolean egg) {
        this.setEgg(egg);
        return this;
    }

    public void setEgg(Boolean egg) {
        this.egg = egg;
    }

    public Boolean getFish() {
        return this.fish;
    }

    public Allergens fish(Boolean fish) {
        this.setFish(fish);
        return this;
    }

    public void setFish(Boolean fish) {
        this.fish = fish;
    }

    public Boolean getLupin() {
        return this.lupin;
    }

    public Allergens lupin(Boolean lupin) {
        this.setLupin(lupin);
        return this;
    }

    public void setLupin(Boolean lupin) {
        this.lupin = lupin;
    }

    public Boolean getMilk() {
        return this.milk;
    }

    public Allergens milk(Boolean milk) {
        this.setMilk(milk);
        return this;
    }

    public void setMilk(Boolean milk) {
        this.milk = milk;
    }

    public Boolean getMolluscs() {
        return this.molluscs;
    }

    public Allergens molluscs(Boolean molluscs) {
        this.setMolluscs(molluscs);
        return this;
    }

    public void setMolluscs(Boolean molluscs) {
        this.molluscs = molluscs;
    }

    public Boolean getMustard() {
        return this.mustard;
    }

    public Allergens mustard(Boolean mustard) {
        this.setMustard(mustard);
        return this;
    }

    public void setMustard(Boolean mustard) {
        this.mustard = mustard;
    }

    public Boolean getNuts() {
        return this.nuts;
    }

    public Allergens nuts(Boolean nuts) {
        this.setNuts(nuts);
        return this;
    }

    public void setNuts(Boolean nuts) {
        this.nuts = nuts;
    }

    public Boolean getPeanuts() {
        return this.peanuts;
    }

    public Allergens peanuts(Boolean peanuts) {
        this.setPeanuts(peanuts);
        return this;
    }

    public void setPeanuts(Boolean peanuts) {
        this.peanuts = peanuts;
    }

    public Boolean getSesame() {
        return this.sesame;
    }

    public Allergens sesame(Boolean sesame) {
        this.setSesame(sesame);
        return this;
    }

    public void setSesame(Boolean sesame) {
        this.sesame = sesame;
    }

    public Boolean getSoya() {
        return this.soya;
    }

    public Allergens soya(Boolean soya) {
        this.setSoya(soya);
        return this;
    }

    public void setSoya(Boolean soya) {
        this.soya = soya;
    }

    public Boolean getSulphur() {
        return this.sulphur;
    }

    public Allergens sulphur(Boolean sulphur) {
        this.setSulphur(sulphur);
        return this;
    }

    public void setSulphur(Boolean sulphur) {
        this.sulphur = sulphur;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Allergens user(User user) {
        this.setUser(user);
        return this;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Allergens post(Post post) {
        this.setPost(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Allergens)) {
            return false;
        }
        return id != null && id.equals(((Allergens) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Allergens{" +
            "id=" + getId() +
            ", celery='" + getCelery() + "'" +
            ", gluten='" + getGluten() + "'" +
            ", crustaceans='" + getCrustaceans() + "'" +
            ", egg='" + getEgg() + "'" +
            ", fish='" + getFish() + "'" +
            ", lupin='" + getLupin() + "'" +
            ", milk='" + getMilk() + "'" +
            ", molluscs='" + getMolluscs() + "'" +
            ", mustard='" + getMustard() + "'" +
            ", nuts='" + getNuts() + "'" +
            ", peanuts='" + getPeanuts() + "'" +
            ", sesame='" + getSesame() + "'" +
            ", soya='" + getSoya() + "'" +
            ", sulphur='" + getSulphur() + "'" +
            "}";
    }
}
