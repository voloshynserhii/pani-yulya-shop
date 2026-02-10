export interface Toy {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  price: number;
  rating: number;
}

export const toys: Toy[] = [
  {
    id: "toy-2",
    title: "Набір для творчості - KINETIC SAND",
    description: "Кінетичний пісок для створення неймовірних фігур. Розвиває моторику та уяву дитини.",
    imageSrc: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
    price: 450,
    rating: 4.7
  },
  {
    id: "toy-4",
    title: "Машинка на радіокеруванні - Exost",
    description: "Швидка та маневрена машинка для гонок по бездоріжжю. Виконує трюки та перевороти.",
    imageSrc: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80",
    price: 2100,
    rating: 5.0
  },
  {
    id: "toy-6",
    title: "Конструктор LEGO DUPLO",
    description: "Перший конструктор для малюків. Великі деталі, безпечні матеріали та яскраві кольори.",
    imageSrc: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    price: 899,
    rating: 4.9
  }
];