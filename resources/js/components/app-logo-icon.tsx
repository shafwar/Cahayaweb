import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img {...props} src="/cahayanbiyalogo.png" alt="Cahaya Anbiya Logo" className={`object-contain ${props.className || ''}`} />;
}
