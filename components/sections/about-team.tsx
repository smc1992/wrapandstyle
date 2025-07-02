import Image from 'next/image';
import { Mail, Phone, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
};

async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('team_members').select('*');

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data.map((member: any) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    imageUrl: member.image_url,
    email: member.email,
    phone: member.phone,
  }));
}

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="text-center bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-cyan-500/50 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        {member.imageUrl ? (
          <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
        ) : (
          <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-primary dark:text-cyan-400 font-semibold">{member.role}</p>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {member.email && <a href={`mailto:${member.email}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors">
          <Mail size={16} />
          <span>E-Mail</span>
        </a>}
        {member.phone && <a href={`tel:${member.phone}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors">
          <Phone size={16} />
          <span>Anrufen</span>
        </a>}
      </div>
    </div>
  );
};

export default async function AboutTeam() {
  const teamMembers = await getTeamMembers();
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Das Team von WNP</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Die Köpfe hinter dem WNP Verlag – eine Kombination aus Branchenexpertise, technischem Know-how und Leidenschaft für Print und Digital.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};
