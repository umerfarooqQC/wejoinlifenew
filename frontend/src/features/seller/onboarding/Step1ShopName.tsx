import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/actions/Button';
import { FormField } from '../../../components/ui/form/FormField';
import { Input } from '../../../components/ui/form/Input';
import { Textarea } from '../../../components/ui/form/Textarea';

export interface Step1ShopNameProps {
  onNext: (data: { shopName: string; description: string }) => void;
  initialData?: { shopName: string; description: string };
}

export const Step1ShopName: React.FC<Step1ShopNameProps> = ({ onNext, initialData }) => {
  const [shopName, setShopName] = useState(initialData?.shopName || 'Bella Italia Bistro');
  const [description, setDescription] = useState(
    initialData?.description ||
      'Serving authentic Neapolitan pizza baked in our traditional stone oven, fresh handmade pasta, crisp garden salads, and Italian desserts crafted with passion.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ shopName, description });
  };

  return (
    <form className="wjl-ob-step" onSubmit={handleSubmit}>
      {/* Top Avatar Circle */}
      <div className="wjl-ob-step1__avatar">
        <span>W</span>
      </div>

      <div className="wjl-ob-step__header">
        <h1 className="wjl-ob-serif-title">Let's set up your restaurant</h1>
        <p className="wjl-ob-subtitle-text">Basic details</p>
      </div>

      <div className="wjl-ob-step__form">
        <FormField label="RESTAURANT NAME" required>
          <div className="wjl-input-with-counter">
            <Input
              value={shopName}
              onChange={(e) => setShopName(e.target.value.slice(0, 60))}
              placeholder="e.g. The Golden Fork"
              required
            />
            <span className="wjl-char-counter">{shopName.length}/60</span>
          </div>
        </FormField>

        <FormField label="SHORT DESCRIPTION">
          <div className="wjl-input-with-counter">
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 160))}
              placeholder="e.g. Fresh Italian cuisine in the heart of the city, loved since 1990."
            />
            <span className="wjl-char-counter">{description.length}/160</span>
          </div>
        </FormField>
      </div>

      <div className="wjl-ob-step__footer">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          pill
          rightIcon={<ArrowRight size={18} />}
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
