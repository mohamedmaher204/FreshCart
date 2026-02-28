import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Browse Our Products | FreshCart Premium Collection',
    description: 'Explore our wide range of premium products from top global brands. FreshCart offers the best deals on electronics, fashion, and lifestyle items.',
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
