import type { Tab } from '@shell/interface/transversal/nav';
import GeneralInformation from '../../components/ministry-labor/revision/GeneralInformation.vue';
import RelatedDocuments from '../../components/ministry-labor/revision/RelatedDocuments.vue';
import OutputDocuments from '../../components/ministry-labor/revision/OutputDocuments.vue';
import Traceability from '../../components/ministry-labor/revision/Traceability.vue';
import Comments from '../../components/ministry-labor/revision/Comments.vue';

export const NAVIGATION_TABS: Tab[] = [
  {
    id: 'general',
    label: 'Información General',
    icon: 'info',
    color: 'bg-orange-6',
    component: GeneralInformation,
    allowedStates: [],
  },
  {
    id: 'documentos',
    label: 'Documentos relacionados',
    icon: 'folder',
    color: 'bg-teal-6',
    component: RelatedDocuments,
    allowedStates: [],
  },
  {
    id: 'documentos-salida',
    label: 'Documentos de salida',
    icon: 'description',
    color: 'bg-purple-6',
    component: OutputDocuments,
    allowedStates: [],
  },
  {
    id: 'trazabilidad',
    label: 'Trazabilidad',
    icon: 'timeline',
    color: 'bg-indigo-6',
    component: Traceability,
    allowedStates: [],
  },
  {
    id: 'comentarios',
    label: 'Comentarios',
    icon: 'chat',
    color: 'bg-pink-6',
    component: undefined,
    allowedStates: [],
  },
];