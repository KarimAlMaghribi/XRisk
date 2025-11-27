import React from "react";
import heroPlaceholder from "../assests/imgs/desert_1-min.png";

interface SectionTestimonialProps {
  variant: "market" | "bus";
  onVariantChange: (variant: "market" | "bus") => void;
}

const testimonials = {
  market: {
    name: "Lena, Künstlerin",
    quote: "\"Ich brauche Sicherheit, damit ich kreativ sein kann. Ohne Sorgen um Wetterausfall.\"",
  },
  bus: {
    name: "Marco, T3-Besitzer",
    quote: "\"Seit Jahren träume ich von dieser Tour. Mit einer Absicherung reise ich entspannter.\"",
  },
};

const SectionTestimonial = ({ variant }: SectionTestimonialProps) => {
  const testimonial = testimonials[variant];
  return (
    <div className="container-grid">
      <div className="grid-12">
        <div className="col-span-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <p className="text-lg-medium text-primary">Erfahrungen aus der Community</p>
            <h2 className="display-large text-primary">{testimonial.quote}</h2>
            <p className="font-semibold text-primary">{testimonial.name}</p>
          </div>
          <div className="relative rounded-[24px] overflow-hidden">
            <img src={heroPlaceholder} alt="Testimonial" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionTestimonial;
