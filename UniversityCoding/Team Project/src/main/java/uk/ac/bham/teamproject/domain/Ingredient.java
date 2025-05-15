package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ingredient.
 */
@Entity
@Table(name = "ingredient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ingredient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "ingredient_name")
    private String ingredientName;

    @Column(name = "price")
    private Float price;

    @Column(name = "shop")
    private String shop;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "dietaryTags" }, allowSetters = true)
    private Post post;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ingredient id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIngredientName() {
        return this.ingredientName;
    }

    public Ingredient ingredientName(String ingredientName) {
        this.setIngredientName(ingredientName);
        return this;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public Float getPrice() {
        return this.price;
    }

    public Ingredient price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getShop() {
        return this.shop;
    }

    public Ingredient shop(String shop) {
        this.setShop(shop);
        return this;
    }

    public void setShop(String shop) {
        this.shop = shop;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Ingredient post(Post post) {
        this.setPost(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ingredient)) {
            return false;
        }
        return id != null && id.equals(((Ingredient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ingredient{" +
            "id=" + getId() +
            ", ingredientName='" + getIngredientName() + "'" +
            ", price=" + getPrice() +
            ", shop='" + getShop() + "'" +
            "}";
    }
}
