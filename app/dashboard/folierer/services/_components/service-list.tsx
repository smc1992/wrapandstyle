'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { deleteService } from '../actions'
import { useToast } from '@/hooks/use-toast'
import { RiDeleteBinLine, RiPencilLine } from 'react-icons/ri'

interface Service {
  id: string
  title: string
  description: string
  icon: string | null
}

interface ServiceListProps {
  services: Service[]
  userId: string
}

export function ServiceList({ services, userId }: ServiceListProps) {
  const { toast } = useToast()

  const handleDelete = async (serviceId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Dienstleistung löschen möchten?')) {
      const result = await deleteService(userId, serviceId)
      if (result.success) {
        toast({
          title: 'Erfolg',
          description: result.message,
        })
      } else {
        toast({
          title: 'Fehler',
          description: result.message,
          variant: 'destructive',
        })
      }
    }
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
        <p className="text-gray-500">Sie haben noch keine Dienstleistungen hinzugefügt.</p>
        <p className="text-gray-500 mt-1">Nutzen Sie das Formular rechts, um Ihre erste Dienstleistung anzulegen.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">{service.title}</CardTitle>
            <div className="flex items-center gap-2">
               {/* TODO: Implement Edit functionality */}
               <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800" title="Bearbeiten (in Kürze verfügbar)" disabled>
                 <RiPencilLine className="h-5 w-5" />
               </Button>
               <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(service.id)}
                title="Löschen"
              >
                <RiDeleteBinLine className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
