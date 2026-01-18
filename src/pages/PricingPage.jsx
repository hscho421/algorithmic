import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthContext from '../context/useAuthContext';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle, XCircle, ArrowRight, Star } from 'lucide-react';

const TIERS = {
  monthly: [
    {
      name: 'Starter',
      price: '$0',
      cadence: 'Free forever',
      description: 'For casual practice and exploration.',
      features: [
        { name: 'Core visualizers', included: true },
        { name: 'Unlimited runs', included: true },
        { name: '3 saved inputs per algorithm', included: true },
        { name: 'Standard theme controls', included: true },
        { name: 'Checkpoint history', included: false },
        { name: 'Pro-only visualizers', included: false },
        { name: 'Layout presets + advanced themes', included: false },
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$12',
      cadence: '/ month',
      description: 'For interview prep and deeper mastery.',
      features: [
        { name: 'Core visualizers', included: true },
        { name: 'Unlimited runs', included: true },
        { name: 'Unlimited saved inputs', included: true },
        { name: 'Standard theme controls', included: true },
        { name: 'Checkpoint history', included: true },
        { name: 'Pro-only visualizers (graphs, DP, strings)', included: true },
        { name: 'Layout presets + advanced themes', included: true },
      ],
      cta: 'Go Pro',
      highlighted: true,
      priceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY,
    },
    {
      name: 'Team',
      price: 'Contact Us',
      cadence: '',
      description: 'For educational institutions and companies.',
      features: [
        { name: 'All Pro features', included: true },
        { name: 'Multi-seat licensing', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom onboarding', included: true },
      ],
      cta: 'Contact Sales',
      highlighted: false,
      isContact: true,
    },
  ],
  annually: [
    {
      name: 'Starter',
      price: '$0',
      cadence: 'Free forever',
      description: 'For casual practice and exploration.',
      features: [
        { name: 'Core visualizers', included: true },
        { name: 'Unlimited runs', included: true },
        { name: '3 saved inputs per algorithm', included: true },
        { name: 'Standard theme controls', included: true },
        { name: 'Checkpoint history', included: false },
        { name: 'Pro-only visualizers', included: false },
        { name: 'Layout presets + advanced themes', included: false },
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$10',
      cadence: '/ month',
      originalPrice: '$12',
      description: 'Save 16% with annual billing.',
      features: [
        { name: 'Core visualizers', included: true },
        { name: 'Unlimited runs', included: true },
        { name: 'Unlimited saved inputs', included: true },
        { name: 'Standard theme controls', included: true },
        { name: 'Checkpoint history', included: true },
        { name: 'Pro-only visualizers (graphs, DP, strings)', included: true },
        { name: 'Layout presets + advanced themes', included: true },
      ],
      cta: 'Go Pro Annual',
      highlighted: true,
      priceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL,
    },
    {
      name: 'Team',
      price: 'Contact Us',
      cadence: '',
      description: 'For educational institutions and companies.',
      features: [
        { name: 'All Pro features', included: true },
        { name: 'Multi-seat licensing', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Custom onboarding', included: true },
      ],
      cta: 'Contact Sales',
      highlighted: false,
      isContact: true,
    },
  ],
};

function TierCard({ tier, isAnnual, isLoading, onCheckout }) {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (tier.isContact) {
      navigate('/contact'); // Assuming a contact page route
    } else if (tier.priceId) {
      onCheckout(tier.priceId);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-lg transition-all duration-300 bg-white/50 dark:bg-zinc-900/50 ${
        tier.highlighted
          ? 'border-emerald-400/70 dark:border-emerald-500/60 ring-2 ring-emerald-400/40 dark:ring-emerald-500/30'
          : 'border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl'
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white">{tier.name}</h2>
        {tier.highlighted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Star size={12} />
            Popular
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{tier.description}</p>
      <div className="mt-6 flex items-baseline gap-2">
        {tier.originalPrice && (
            <span className="text-lg font-medium text-zinc-400 dark:text-zinc-500 line-through">
              {tier.originalPrice}
            </span>
          )}
        <span className="text-4xl font-extrabold font-display text-zinc-900 dark:text-white tracking-tight">{tier.price}</span>
        {tier.cadence && <span className="text-sm text-zinc-400 dark:text-zinc-500">{tier.cadence}</span>}
      </div>
      
      <button
        type="button"
        onClick={handleCTAClick}
        disabled={isLoading && tier.priceId}
        className={`mt-6 w-full group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed ${
          tier.highlighted
            ? 'bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'
            : 'text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
        }`}
      >
        <span>{isLoading && tier.priceId ? 'Processing...' : tier.cta}</span>
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <ul className="mt-8 space-y-3 text-sm text-zinc-600 dark:text-zinc-300 flex-grow">
        {tier.features.map((feature) => (
          <li key={feature.name} className="flex items-start gap-3">
            {feature.included ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-zinc-400 dark:text-zinc-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingPage() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAnnual, setIsAnnual] = useState(false);
  
  const checkoutStatus = new URLSearchParams(location.search).get('checkout');

  const startCheckout = async (priceId) => {
    setErrorMessage('');
    if (!priceId) {
      setErrorMessage('Pricing is not configured yet.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) {
      setIsLoading(false);
      setErrorMessage('Please sign in again.');
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Checkout failed.');
      }
      if (payload?.url) {
        window.location.assign(payload.url);
        return;
      }
      throw new Error('Checkout failed.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tiers = isAnnual ? TIERS.annually : TIERS.monthly;

  return (
    <div className="min-h-screen font-body text-zinc-800 dark:text-zinc-200">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-base font-semibold leading-7 text-emerald-600 dark:text-emerald-400">Pricing</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl font-display">
            Simple pricing for focused learning
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Start free, then upgrade when you want deeper interview prep and advanced visualizers.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative flex items-center rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 p-1">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 w-28 rounded-full py-1.5 text-sm font-medium transition-colors cursor-pointer ${!isAnnual ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 w-28 rounded-full py-1.5 text-sm font-medium transition-colors cursor-pointer ${isAnnual ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'}`}
            >
              Annually
            </button>
            <span 
              className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-28 rounded-full bg-white dark:bg-zinc-700 shadow-sm transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
              aria-hidden="true"
            />
             <span className="absolute top-0 right-[-1.5rem] -mt-2 -mr-16 transform rotate-12">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                2 months free!
              </span>
            </span>
          </div>
        </div>

        {checkoutStatus === 'cancel' && (
          <div className="mt-8 max-w-md mx-auto rounded-2xl border border-amber-200/70 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            Checkout canceled. You can restart anytime.
          </div>
        )}
        {errorMessage && (
          <div className="mt-8 max-w-md mx-auto rounded-2xl border border-rose-200/70 dark:border-rose-500/40 bg-rose-50/70 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier) => (
            <TierCard 
              key={tier.name}
              tier={tier}
              isAnnual={isAnnual}
              isLoading={isLoading}
              onCheckout={startCheckout}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200/70 dark:border-zinc-700/70 px-5 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            Back to visualizers
          </Link>
        </div>
      </div>
    </div>
  );
}