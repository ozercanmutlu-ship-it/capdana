export interface Review {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    text: string;
    productName: string;
    productImage: string;
    date: string;
    verified: boolean;
}

export const reviews: Review[] = [
    {
        id: "rev-01",
        user: "Oğuzhan K.",
        avatar: "https://ui-avatars.com/api/?name=Oguzhan+K&background=111&color=fff",
        rating: 5,
        text: "Crimson Phantom kombinini aldım, kumaş kalitesi ve bandana dokusu beklediğimden çok daha premium. Özellikle paketleme hızı şaşırttı.",
        productName: "Crimson Phantom",
        productImage: "/images/ready/capdana-01.jpg",
        date: "2 gün önce",
        verified: true,
    },
    {
        id: "rev-02",
        user: "Merve A.",
        avatar: "https://ui-avatars.com/api/?name=Merve+A&background=e11d48&color=fff",
        rating: 5,
        text: "Kendi tasarımımı yapmak çok keyifliydi. Shadow Walker front ile neon bandana uyumu efsane oldu. Sokakta herkes soruyor!",
        productName: "Custom Capdana",
        productImage: "/images/capdana-ready/capdana-04.png",
        date: "1 hafta önce",
        verified: true,
    },
    {
        id: "rev-03",
        user: "Canberk T.",
        avatar: "https://ui-avatars.com/api/?name=Canberk+T&background=222&color=fff",
        rating: 4,
        text: "Minimal ama iddialı. Royal Guard modelindeki mor tonu tam istediğim gibi. 1OF1 drop'larını heyecanla bekliyorum.",
        productName: "Royal Guard",
        productImage: "/images/capdana-ready/capdana-02.png",
        date: "3 gün önce",
        verified: true,
    },
    {
        id: "rev-04",
        user: "Selin Y.",
        avatar: "https://ui-avatars.com/api/?name=Selin+Y&background=ff4d4d&color=fff",
        rating: 5,
        text: "Capdana gerçekten bu işi biliyor. Drill estetiğini bozmadan bu kadar kaliteli bir ürün çıkarmak büyük başarı.",
        productName: "Urban Ghost",
        productImage: "/images/capdana-ready/capdana-03.png",
        date: "5 gün önce",
        verified: true,
    },
    {
        id: "rev-05",
        user: "Emre B.",
        avatar: "https://ui-avatars.com/api/?name=Emre+B&background=333&color=fff",
        rating: 5,
        text: "Kargolama hızı ve ürünün kutusu bile prestij kokuyor. Midnight Drift kombinini kesinlikle tavsiye ederim.",
        productName: "Midnight Drift",
        productImage: "/images/capdana-ready/capdana-02.png",
        date: "10 gün önce",
        verified: true,
    }
];
