export interface Review {
  id: string;
  name: string;
  avatarSrc: string;
  text: string;
  handle: string;
}

export const reviews: Review[] = [
  {
    id: "review-1",
    name: "Олена Іваненко",
    avatarSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    handle: "@olena_i",
    text: "Пані Юля зробила день народження моєї доньки незабутнім! Відеопривітання було таким щирим і персоналізованим. Дуже дякуємо!",
  },
  {
    id: "review-2",
    name: "Максим Петренко",
    avatarSrc: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=100&q=80",
    handle: "@max_p",
    text: "Пісні Пані Юлі - це просто знахідка! Діти слухають їх постійно. Веселі, добрі та повчальні. Рекомендую всім батькам.",
  },
  {
    id: "review-3",
    name: "Анна Ковальчук",
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    handle: "@anna_k",
    text: "Замовляли відеопривітання для сина. Він був у захваті, коли побачив, що його улюблена героїня звертається до нього особисто!",
  },
  {
    id: "review-4",
    name: "Сергій Сидоренко",
    avatarSrc: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=100&q=80",
    handle: "@serhiy_s",
    text: "Дуже якісний контент для дітей. Пані Юля - справжній професіонал своєї справи. Іграшки, які вона рекомендує, завжди цікаві та корисні.",
  },
  {
    id: "review-5",
    name: "Юлія Мельник",
    avatarSrc: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=100&q=80",
    handle: "@yulia_m",
    text: "Ми в захваті від творчості Пані Юлі! Кожне відео, кожна пісня - це маленький шедевр, створений з любов'ю до дітей.",
  },
];