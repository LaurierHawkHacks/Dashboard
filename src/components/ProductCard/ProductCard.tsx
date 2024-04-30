import { FC } from "react";

interface Product {
    image?: string;
    title?: string;
    description?: string;
    link?: string;
}

const ProductCard: FC<Product> = ({ image, title, description, link }) => {
    return (
        <article className="product" aria-label={title}>
            <header className="product__images" role="banner">
                <img src={image} alt={title} />
            </header>
            <div className="product__infos">
                <a href={link} className="product__cta">
                    <h3 className="product__title">{title}</h3>
                    <p className="product__description">{description}</p>
                </a>
            </div>
        </article>
    );
};

export { ProductCard };
