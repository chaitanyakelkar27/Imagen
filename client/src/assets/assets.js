import logo from './logo.svg'
import logo_icon from './logo_icon.svg'
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_icon from './twitter_icon.svg'
import star_icon from './star_icon.svg'
import rating_star from './rating_star.svg'
import sample_img_1 from './sample_img_1.png'
import sample_img_2 from './sample_img_2.png'
import profile_img_1 from './profile_img_1.png'
import profile_img_2 from './profile_img_2.png'
import step_icon_1 from './step_icon_1.svg'
import step_icon_2 from './step_icon_2.svg'
import step_icon_3 from './step_icon_3.svg'
import email_icon from './email_icon.svg'
import lock_icon from './lock_icon.svg'
import cross_icon from './cross_icon.svg'
import star_group from './star_group.png'
import credit_star from './credit_star.svg'
import profile_icon from './profile_icon.png'

export const assets = {
  logo,
  logo_icon,
  facebook_icon,
  instagram_icon,
  twitter_icon,
  star_icon,
  rating_star,
  sample_img_1,
  sample_img_2,
  email_icon,
  lock_icon,
  cross_icon,
  star_group,
  credit_star,
  profile_icon
}

export const stepsData = [
  {
    title: 'Express Your Concept',
    description: 'Share your creative idea through text - from simple phrases to detailed descriptions of your desired visual.',
    icon: step_icon_1,
  },
  {
    title: 'AI Brings It to Life',
    description: 'Our intelligent system instantly interprets your words and crafts a unique, professional-grade image.',
    icon: step_icon_2,
  },
  {
    title: 'Save & Showcase',
    description: 'Export your masterpiece in high resolution or share it instantly across your favorite platforms.',
    icon: step_icon_3,
  },
];

export const testimonialsData = [
  {
    image: profile_img_1,
    name: 'Michael Chen',
    role: 'Digital Artist',
    stars: 5,
    text: `This platform has revolutionized my creative workflow. The AI understands my vision perfectly and delivers stunning results every single time.`
  },
  {
    image: profile_img_2,
    name: 'Sarah Mitchell',
    role: 'Marketing Specialist',
    stars: 5,
    text: `Creating professional visuals for campaigns has never been easier. The quality is exceptional and it saves me hours of design work.`
  },
  {
    image: profile_img_1,
    name: 'James Rodriguez',
    role: 'Creative Director',
    stars: 5,
    text: `An absolute game-changer for our creative team. We can prototype visual concepts instantly and iterate faster than ever before.`
  },
]

export const plans = [
  {
    id: 'Basic',
    price: 10,
    credits: 100,
    desc: 'Best for personal use.'
  },
  {
    id: 'Advanced',
    price: 50,
    credits: 500,
    desc: 'Best for business use.'
  },
  {
    id: 'Business',
    price: 250,
    credits: 5000,
    desc: 'Best for enterprise use.'
  },
]