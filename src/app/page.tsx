import { Shield, Camera, FileText, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                Bluhatch
              </span>
            </div>
            <nav className="hidden space-x-8 md:flex">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </nav>
            <div className="flex space-x-4">
              <a href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </a>
              <a
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Bulletproof Documentation for
            <span className="text-blue-600"> Trade Disputes</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            Capture legally admissible evidence with GPS location, blockchain
            timestamping, and generate comprehensive dispute protection reports.
            Protect your business from payment disputes.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/register"
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Start 7-Day Free Trial
            </a>
            <a
              href="/login"
              className="rounded-lg border border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 transition-colors hover:bg-blue-50"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-20">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Everything You Need for Dispute Protection
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Camera className="mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Evidence Capture
              </h3>
              <p className="text-gray-600">
                High-resolution photos with automatic GPS embedding and
                tamper-proof timestamps.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <Shield className="mb-4 h-12 w-12 text-green-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Blockchain Security
              </h3>
              <p className="text-gray-600">
                OpenTimestamps integration ensures your evidence is
                cryptographically verified.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <FileText className="mb-4 h-12 w-12 text-purple-600" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Legal Reports
              </h3>
              <p className="text-gray-600">
                Generate court-ready dispute protection reports with all
                evidence and metadata.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-20 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why Tradespeople Choose Bluhatch
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="mt-1 mr-3 h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Legal Admissibility
                  </h3>
                  <p className="text-gray-600">
                    Evidence meets UK court standards with proper timestamps and
                    GPS data.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mt-1 mr-3 h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    One-Handed Operation
                  </h3>
                  <p className="text-gray-600">
                    Designed for tradespeople with dirty hands and work gloves.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mt-1 mr-3 h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Offline Capability
                  </h3>
                  <p className="text-gray-600">
                    Capture evidence even without internet connection.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="mt-1 mr-3 h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Professional Reports
                  </h3>
                  <p className="text-gray-600">
                    Generate comprehensive reports that insurance companies and
                    courts respect.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mt-1 mr-3 h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Client Approvals
                  </h3>
                  <p className="text-gray-600">
                    Digital signature capture for work approvals and change
                    orders.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mt-1 mr-3 h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Audit Trail
                  </h3>
                  <p className="text-gray-600">
                    Complete chain of custody documentation for every piece of
                    evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mt-20">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Professional Plan
              </h3>
              <div className="mb-4 text-4xl font-bold text-blue-600">
                £99<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="mb-6 text-gray-600">
                Everything you need for complete dispute protection
              </p>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                <span className="text-gray-700">Unlimited jobs</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                <span className="text-gray-700">Professional reports</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                <span className="text-gray-700">100GB cloud storage</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                <span className="text-gray-700">Email support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
                <span className="text-gray-700">Blockchain timestamping</span>
              </li>
            </ul>
            <a
              href="/register"
              className="block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Start 7-Day Free Trial
            </a>
            <p className="mt-4 text-center text-sm text-gray-600">
              7-day free trial • Less than one hour of legal consultation
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold">Bluhatch</span>
              </div>
              <p className="text-gray-400">
                The only app that turns every job into legally bulletproof
                documentation.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Legal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bluhatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
