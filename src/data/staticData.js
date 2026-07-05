const services = [
  {
    id: 's1',
    serviceName: 'Bridal Makeup',
    category: 'Makeup',
    duration: 120,
    price: 8000,
    description: 'Complete bridal makeup package with trial.',
    imageUrl:
      'https://media6.ppl-media.com/mediafiles/blogs/shutterstock_1925473556_ba71a00ef4.jpg',
  },
  {
    id: 's2',
    serviceName: 'Party Makeup',
    category: 'Makeup',
    duration: 60,
    price: 2500,
    description: 'Glam party makeup for special occasions.',
    imageUrl:
      'https://q3salon.in/wp-content/uploads/al_opt_content/IMAGE/q3salon.in/wp-content/uploads/2025/12/ChatGPT-Image-Dec-30-2025-05_51_46-PM.png.bv_resized_mobile.png.bv.webp?bv_host=q3salon.in',
  },
  {
    id: 's3',
    serviceName: 'Semi-Permanent Make-up',
    category: 'Makeup',
    duration: 90,
    price: 6000,
    description: 'Long-lasting semi-permanent makeup.',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKle7rWVXfhALcGrekkSqLb3N5FJ7mU7hDtA&s',
  },
  {
    id: 's4',
    serviceName: 'Hydra Facial',
    category: 'Skincare',
    duration: 75,
    price: 3500,
    description: 'Deep cleansing and hydration facial.',
    imageUrl:
      'https://kohaclinics.com/wp-content/uploads/2019/09/aesthetic-clinic-What-are-the-Benefits-of-a-Hydra-Facial-blog-image.jpg',
  },
  {
    id: 's5',
    serviceName: 'Facial (All Types)',
    category: 'Skincare',
    duration: 60,
    price: 2000,
    description: 'Customized facial for all skin types.',
    imageUrl:
      'https://kimera.in/wp-content/uploads/2024/12/How-Do-Different-Types-of-Facials-Work.webp',
  },
  {
    id: 's6',
    serviceName: 'Hair Straightening',
    category: 'Hair',
    duration: 120,
    price: 5000,
    description: 'Smooth and straight hair treatment.',
    imageUrl:
      'https://jawedhabiblucknow.in/images/blog/1/best-salon-for-rebonding-in-lucknow.jpg',
  },
  {
    id: 's7',
    serviceName: 'Keratin Treatment',
    category: 'Hair',
    duration: 120,
    price: 5500,
    description: 'Frizz control and hair smoothing treatment.',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcdGm55TC7QRz8fpdH3qVlNWpSLzMicjeFng&s',
  },
  {
    id: 's8',
    serviceName: 'Hair Cut & Hair Colouring',
    category: 'Hair',
    duration: 90,
    price: 3000,
    description: 'Professional haircut and coloring services.',
    imageUrl:
      'https://www.therapyhairstudio.com/wp-content/uploads/2024/08/How-Long-Does-It-Take-To-Dye-Your-Hair-At-The-Salon_-Image-raw.webp',
  },
  {
    id: 's9',
    serviceName: 'Hair Extensions',
    category: 'Hair',
    duration: 90,
    price: 7000,
    description: 'Natural-looking hair extension services.',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyeuzDvYKM2FuOMI6MizNCkwsAkN1Mza7Sxw&s',
  },
  {
    id: 's10',
    serviceName: 'Manicure & Pedicure',
    category: 'Nails',
    duration: 60,
    price: 1800,
    description: 'Complete hand and foot care treatment.',
    imageUrl: 'https://d2p5rd30inmhrb.cloudfront.net/fe/Blogs-VLCC/core-blogs/30/1.jpeg',
  },
  {
    id: 's11',
    serviceName: 'Nail Art',
    category: 'Nails',
    duration: 45,
    price: 1200,
    description: 'Creative and trendy nail designs.',
    imageUrl: 'https://mylee.co.uk/cdn/shop/articles/img-1685703495240_1200x.jpg?v=1697635695',
  },
  {
    id: 's12',
    serviceName: 'Mehendi',
    category: 'Other',
    duration: 60,
    price: 2500,
    description: 'Traditional and modern mehendi designs.',
    imageUrl:
      'https://image.wedmegood.com/resized/720X/uploads/member/875664/1741331508_image1710.jpg',
  },
];

const mediaItems = [
  {
    id: '1',
    isImageOrVideo: 'image',
    mediaUrl:
      'https://instagram.fhyd1-3.fna.fbcdn.net/v/t51.82787-15/641334090_18073976930632866_4414604788333408173_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=MzgzOTMxMzk5ODM5NTcwMzk2NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=mZBi8PahR_sQ7kNvwHE6kM_&_nc_oc=AdpxjI-Bxs7Iy8VH7uQeh6crFe0RcgaQRoZ5oQ-VDe-sN8DGoUl9Y7QNYnuViiieQjK--rZYJQ_oFZFUqgw9Ysv-&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fhyd1-3.fna&_nc_gid=exp0vedECbpIjiNOHXw3jA&_nc_ss=7a22e&oh=00_Af6JGtX6m1eh1991QPwPfSLjKTn0Nhzw9xx12g5VAKuZLg&oe=6A1D0B2C',
  },
  {
    id: '2',
    isImageOrVideo: 'image',
    mediaUrl:
      'https://instagram.fhyd1-7.fna.fbcdn.net/v/t51.82787-15/589920719_18066224483632866_2021316895411644575_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzc4NzkwNDI2NTI5NDM4NDk2Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=88tLoY0UIDkQ7kNvwFEBKIk&_nc_oc=AdqrGjqqu6mylhCrUKAXEJihURPTlPAEXybIOzv4l9lAMjRsL8kMBqMo02wTfB_ZJRzQFZLKIs4-rJoj-vXpcJ8S&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fhyd1-7.fna&_nc_gid=WYZgThEk4BYB5oVu2gUlcA&_nc_ss=7a22e&oh=00_Af6lqDi0cYdcadK-Yt7K11iGDRhrZUhkmd95nkk716NkCQ&oe=6A1CE7F3',
  },
  {
    id: '3',
    isImageOrVideo: 'image',
    mediaUrl:
      'https://instagram.fhyd1-3.fna.fbcdn.net/v/t51.82787-15/588754805_18065562308632866_7647110605711676243_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=104&ig_cache_key=Mzc4MzQyMDM5OTQ5ODU0MTkyMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=uTyke1y3pd8Q7kNvwEk6pmA&_nc_oc=Adr1TdcYXUjgcCEzOBhYnXZlmvYi2Nl51ojb6djOuI6ceP9NReU-gJGJQY4LoAvRofLVenVROR7FRlnZQIKDeQig&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=instagram.fhyd1-3.fna&_nc_gid=WYZgThEk4BYB5oVu2gUlcA&_nc_ss=7a22e&oh=00_Af48KFFo3MIPgvuqrBpxJgzWAdnc7Smx_oZfgk7_RiaOnQ&oe=6A1D1636',
  },
  { id: '4', isImageOrVideo: 'image', mediaUrl: 'https://picsum.photos/seed/hair4/800/1000' },
  { id: '5', isImageOrVideo: 'image', mediaUrl: 'https://picsum.photos/seed/hair5/800/1000' },
  { id: '6', isImageOrVideo: 'image', mediaUrl: 'https://picsum.photos/seed/hair6/800/1000' },
  { id: '7', isImageOrVideo: 'image', mediaUrl: 'https://picsum.photos/seed/hair7/800/1000' },
  { id: '8', isImageOrVideo: 'image', mediaUrl: 'https://picsum.photos/seed/hair8/800/1000' },
  { id: '9', isImageOrVideo: 'video', mediaUrl: 'https://www.instagram.com/reel/DW3sndtgYiO/' },
  { id: '10', isImageOrVideo: 'video', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const reviews = [
  { id: 'f1', customerName: 'Aishwarya', review: 'Absolutely loved my bridal makeup!' },
  { id: 'f2', customerName: 'Sneha', review: 'Great service, very friendly artist.' },
  { id: 'f3', customerName: 'Pooja', review: 'Best makeup studio in Hyderabad!' },
];

const bookings = [];

module.exports = {
  services,
  mediaItems,
  reviews,
  bookings,
};
