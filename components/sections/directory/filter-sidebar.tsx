import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const specializations = [
  { id: 'vollfolierung', label: 'Vollfolierung' },
  { id: 'teilfolierung', label: 'Teilfolierung' },
  { id: 'farbwechsel', label: 'Farbwechsel' },
  { id: 'schutzfolierung', label: 'Schutzfolierung' },
  { id: 'designfolierung', label: 'Designfolierung' },
];

const vehicleTypes = [
  { id: 'pkw', label: 'PKW' },
  { id: 'motorrad', label: 'Motorrad' },
  { id: 'nutzfahrzeuge', label: 'Nutzfahrzeuge' },
  { id: 'boote', label: 'Boote' },
];

export function FilterSidebar() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 lg:sticky top-24">
      <h3 className="text-2xl font-bold mb-6">Folierer finden</h3>
      
      <div className="mb-6">
        <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Ort oder PLZ</Label>
        <Input type="text" id="location" placeholder="z.B. Berlin oder 10115" />
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">Spezialisierung</h4>
        <div className="space-y-3">
          {specializations.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} />
              <Label htmlFor={item.id} className="text-sm font-normal">{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-medium mb-3 text-gray-800">Fahrzeugtyp</h4>
        <div className="space-y-3">
          {vehicleTypes.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} />
              <Label htmlFor={item.id} className="text-sm font-normal">{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 !rounded-button font-medium">
        Suche starten
      </Button>
    </div>
  );
}
