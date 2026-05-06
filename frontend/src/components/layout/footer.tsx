import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Urban<span className="text-primary">Service</span></h3>
            <p className="text-sm text-muted-foreground">Quality home services, on demand. The easiest way to book professionals for all your home needs.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-black">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-black">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-black">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/reviews" className="hover:text-black">UC Reviews</Link></li>
              <li><Link href="/categories" className="hover:text-black">Categories Near You</Link></li>
              <li><Link href="/helpcenter" className="hover:text-black">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Partners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/partner" className="hover:text-black">Register as Professional</Link></li>
              <li><Link href="/partner-help" className="hover:text-black">Partner Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Urban Service Technologies Ltd.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
