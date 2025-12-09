import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { ImageUpload } from '@/components/image-upload';
import AppLayout from '@/layouts/app-layout';
import ConfigController, { index, store } from '@/actions/App/Http/Controllers/ConfigController';
import { type BreadcrumbItem, type Place } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    Building2,
    Palette,
    LayoutDashboard,
    Shield,
    Users,
    Globe,
    FileText,
    Bell,
    Boxes,
    Plug,
    BarChart3,
    CreditCard,
    Settings2,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Configurations', href: index().url },
    { title: 'Nouvelle configuration', href: ConfigController.create().url },
];

type Section = {
    id: string;
    title: string;
    icon: React.ElementType;
    subsections: Subsection[];
};

type Subsection = {
    id: string;
    title: string;
    fields: Field[];
};

type Field = {
    name: string;
    label: string;
    type: 'text' | 'email' | 'url' | 'number' | 'color' | 'textarea' | 'checkbox' | 'select' | 'file';
    defaultValue?: string | number | boolean;
    options?: { value: string; label: string }[];
    description?: string;
    accept?: string;
};

const configSections: Section[] = [
    {
        id: 'organization',
        title: 'Informations de l\'Organisation',
        icon: Building2,
        subsections: [
            {
                id: 'identity',
                title: 'Identité',
                fields: [
                    { name: 'place_id', label: 'Lieu', type: 'select', options: [] },
                    { name: 'organization_name', label: 'Nom de l\'organisation', type: 'text' },
                    { name: 'organization_short_name', label: 'Nom court', type: 'text' },
                    { name: 'slogan', label: 'Slogan', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'type_organisation', label: 'Type d\'organisation', type: 'text', description: 'Entreprise, ONG, hôtel, administration, etc.' },
                    { name: 'secteur_activite', label: 'Secteur d\'activité', type: 'text' },
                ],
            },
            {
                id: 'contact',
                title: 'Coordonnées',
                fields: [
                    { name: 'email_principal', label: 'Email principal', type: 'email' },
                    { name: 'telephone_principal', label: 'Téléphone principal', type: 'text' },
                    { name: 'telephone_secondaire', label: 'Téléphone secondaire', type: 'text' },
                    { name: 'adresse', label: 'Adresse', type: 'textarea' },
                    { name: 'ville', label: 'Ville', type: 'text' },
                    { name: 'pays', label: 'Pays', type: 'text' },
                    { name: 'site_web', label: 'Site web', type: 'url' },
                ],
            },
        ],
    },
    {
        id: 'theme',
        title: 'Thème & Apparence',
        icon: Palette,
        subsections: [
            {
                id: 'logos',
                title: 'Logos & Images',
                fields: [
                    { name: 'logo_light', label: 'Logo (mode clair)', type: 'file', accept: 'image/*', description: 'Format accepté: PNG, JPG, SVG' },
                    { name: 'logo_dark', label: 'Logo (mode sombre)', type: 'file', accept: 'image/*', description: 'Format accepté: PNG, JPG, SVG' },
                    { name: 'favicon', label: 'Favicon', type: 'file', accept: 'image/x-icon,image/png', description: 'Format accepté: ICO, PNG (16x16 ou 32x32)' },
                    { name: 'background_login', label: 'Image de fond (connexion)', type: 'file', accept: 'image/*', description: 'Format accepté: PNG, JPG' },
                    { name: 'background_dashboard', label: 'Image de fond (tableau de bord)', type: 'file', accept: 'image/*', description: 'Format accepté: PNG, JPG' },
                ],
            },
            {
                id: 'colors',
                title: 'Couleurs',
                fields: [
                    { name: 'primary_color', label: 'Couleur primaire', type: 'color' },
                    { name: 'secondary_color', label: 'Couleur secondaire', type: 'color' },
                    { name: 'accent_color', label: 'Couleur accent', type: 'color' },
                    { name: 'success_color', label: 'Couleur succès', type: 'color' },
                    { name: 'warning_color', label: 'Couleur avertissement', type: 'color' },
                    { name: 'danger_color', label: 'Couleur danger', type: 'color' },
                    { name: 'background_color', label: 'Couleur de fond', type: 'color' },
                    { name: 'text_color', label: 'Couleur du texte', type: 'color' },
                ],
            },
            {
                id: 'typography',
                title: 'Typographie',
                fields: [
                    { name: 'font_family', label: 'Police de caractères', type: 'text' },
                    { name: 'font_size_base', label: 'Taille de base', type: 'text', description: 'Ex: 16px, 1rem' },
                    { name: 'font_size_title', label: 'Taille des titres', type: 'text', description: 'Ex: 24px, 1.5rem' },
                    { name: 'font_weight', label: 'Épaisseur', type: 'text', description: 'Ex: 400, 500, 600' },
                ],
            },
            {
                id: 'layout',
                title: 'Mise en page',
                fields: [
                    { name: 'layout_type', label: 'Type de mise en page', type: 'select', options: [
                        { value: 'sidebar', label: 'Sidebar' },
                        { value: 'topbar', label: 'Topbar' },
                        { value: 'mixed', label: 'Mixte' },
                    ] },
                    { name: 'sidebar_position', label: 'Position de la sidebar', type: 'select', options: [
                        { value: 'left', label: 'Gauche' },
                        { value: 'right', label: 'Droite' },
                    ] },
                    { name: 'sidebar_collapsed_by_default', label: 'Sidebar réduite par défaut', type: 'checkbox', defaultValue: false },
                    { name: 'border_radius', label: 'Rayon des bordures', type: 'text', description: 'Ex: 4px, 8px' },
                    { name: 'shadow_style', label: 'Style d\'ombre', type: 'text' },
                ],
            },
        ],
    },
    {
        id: 'navigation',
        title: 'Navigation & Structure',
        icon: LayoutDashboard,
        subsections: [
            {
                id: 'sidebar',
                title: 'Sidebar / Menu',
                fields: [
                    { name: 'show_sidebar', label: 'Afficher la sidebar', type: 'checkbox', defaultValue: true },
                    { name: 'sidebar_icon_style', label: 'Style des icônes', type: 'text' },
                    { name: 'show_icons_only', label: 'Icônes uniquement', type: 'checkbox', defaultValue: false },
                    { name: 'custom_sidebar_html', label: 'HTML personnalisé', type: 'textarea' },
                ],
            },
            {
                id: 'header',
                title: 'En-tête',
                fields: [
                    { name: 'show_header', label: 'Afficher l\'en-tête', type: 'checkbox', defaultValue: true },
                    { name: 'header_type', label: 'Type d\'en-tête', type: 'select', options: [
                        { value: 'fixed', label: 'Fixe' },
                        { value: 'static', label: 'Statique' },
                    ] },
                    { name: 'header_background_color', label: 'Couleur de fond', type: 'color' },
                    { name: 'custom_header_html', label: 'HTML personnalisé', type: 'textarea' },
                ],
            },
            {
                id: 'footer',
                title: 'Pied de page',
                fields: [
                    { name: 'show_footer', label: 'Afficher le pied de page', type: 'checkbox', defaultValue: true },
                    { name: 'footer_text', label: 'Texte du pied de page', type: 'textarea' },
                    { name: 'footer_background_color', label: 'Couleur de fond', type: 'color' },
                ],
            },
        ],
    },
    {
        id: 'security',
        title: 'Sécurité & Authentification',
        icon: Shield,
        subsections: [
            {
                id: 'auth',
                title: 'Authentification',
                fields: [
                    { name: 'enable_registration', label: 'Permettre l\'inscription', type: 'checkbox', defaultValue: true },
                    { name: 'require_email_verification', label: 'Vérification email obligatoire', type: 'checkbox', defaultValue: false },
                    { name: 'require_phone_verification', label: 'Vérification téléphone obligatoire', type: 'checkbox', defaultValue: false },
                    { name: 'enable_2fa', label: 'Authentification à deux facteurs', type: 'checkbox', defaultValue: false },
                    { name: 'password_min_length', label: 'Longueur minimale du mot de passe', type: 'number', defaultValue: 8 },
                    { name: 'password_require_special_char', label: 'Caractère spécial requis', type: 'checkbox', defaultValue: false },
                    { name: 'password_require_number', label: 'Chiffre requis', type: 'checkbox', defaultValue: false },
                ],
            },
            {
                id: 'sessions',
                title: 'Sessions',
                fields: [
                    { name: 'session_timeout_minutes', label: 'Timeout de session (minutes)', type: 'number', defaultValue: 120 },
                    { name: 'max_login_attempts', label: 'Tentatives de connexion max', type: 'number', defaultValue: 5 },
                    { name: 'lock_account_after_failures', label: 'Verrouiller après échecs', type: 'checkbox', defaultValue: true },
                ],
            },
            {
                id: 'access',
                title: 'Accès',
                fields: [
                    { name: 'roles_enabled', label: 'Rôles activés', type: 'checkbox', defaultValue: true },
                    { name: 'permissions_customizable', label: 'Permissions personnalisables', type: 'checkbox', defaultValue: true },
                    { name: 'default_role_on_register', label: 'Rôle par défaut à l\'inscription', type: 'text', defaultValue: 'user' },
                ],
            },
        ],
    },
    {
        id: 'users',
        title: 'Utilisateurs & Préférences',
        icon: Users,
        subsections: [
            {
                id: 'user_prefs',
                title: 'Préférences Utilisateur',
                fields: [
                    { name: 'allow_avatar_upload', label: 'Autoriser l\'upload d\'avatar', type: 'checkbox', defaultValue: true },
                    { name: 'default_language', label: 'Langue par défaut', type: 'text', defaultValue: 'fr' },
                    { name: 'timezone', label: 'Fuseau horaire', type: 'text', defaultValue: 'UTC' },
                    { name: 'date_format', label: 'Format de date', type: 'text', defaultValue: 'd/m/Y' },
                    { name: 'time_format', label: 'Format d\'heure', type: 'text', defaultValue: 'H:i' },
                ],
            },
        ],
    },
    {
        id: 'localization',
        title: 'Langue & Localisation',
        icon: Globe,
        subsections: [
            {
                id: 'locale',
                title: 'Paramètres régionaux',
                fields: [
                    { name: 'currency', label: 'Devise', type: 'text', defaultValue: 'EUR' },
                    { name: 'currency_position', label: 'Position de la devise', type: 'select', options: [
                        { value: 'before', label: 'Avant' },
                        { value: 'after', label: 'Après' },
                    ] },
                    { name: 'number_format', label: 'Format des nombres', type: 'text' },
                    { name: 'first_day_of_week', label: 'Premier jour de la semaine', type: 'select', options: [
                        { value: '0', label: 'Dimanche' },
                        { value: '1', label: 'Lundi' },
                        { value: '2', label: 'Mardi' },
                        { value: '3', label: 'Mercredi' },
                        { value: '4', label: 'Jeudi' },
                        { value: '5', label: 'Vendredi' },
                        { value: '6', label: 'Samedi' },
                    ] },
                ],
            },
        ],
    },
    {
        id: 'documents',
        title: 'Documents & Contenu',
        icon: FileText,
        subsections: [
            {
                id: 'document_settings',
                title: 'Paramètres des documents',
                fields: [
                    { name: 'max_file_size', label: 'Taille maximale de fichier (Ko)', type: 'number', defaultValue: 10240 },
                    { name: 'auto_generate_reference', label: 'Générer les références automatiquement', type: 'checkbox', defaultValue: true },
                    { name: 'document_prefix', label: 'Préfixe des documents', type: 'text', defaultValue: 'DOC' },
                    { name: 'storage_location', label: 'Emplacement de stockage', type: 'select', options: [
                        { value: 'local', label: 'Local' },
                        { value: 's3', label: 'S3' },
                        { value: 'cloud', label: 'Cloud' },
                    ] },
                ],
            },
            {
                id: 'custom_content',
                title: 'Contenus personnalisés',
                fields: [
                    { name: 'terms_and_conditions', label: 'Conditions générales', type: 'textarea' },
                    { name: 'privacy_policy', label: 'Politique de confidentialité', type: 'textarea' },
                ],
            },
        ],
    },
    {
        id: 'communications',
        title: 'Notifications & Communications',
        icon: Bell,
        subsections: [
            {
                id: 'email',
                title: 'Email',
                fields: [
                    { name: 'mail_driver', label: 'Driver de mail', type: 'text', defaultValue: 'smtp' },
                    { name: 'mail_host', label: 'Hôte SMTP', type: 'text' },
                    { name: 'mail_port', label: 'Port SMTP', type: 'number', defaultValue: 587 },
                    { name: 'mail_from_name', label: 'Nom de l\'expéditeur', type: 'text' },
                    { name: 'mail_from_address', label: 'Email de l\'expéditeur', type: 'email' },
                    { name: 'mail_signature', label: 'Signature email', type: 'textarea' },
                ],
            },
            {
                id: 'messaging',
                title: 'SMS / WhatsApp / Chat',
                fields: [
                    { name: 'enable_sms', label: 'Activer SMS', type: 'checkbox', defaultValue: false },
                    { name: 'enable_whatsapp', label: 'Activer WhatsApp', type: 'checkbox', defaultValue: false },
                    { name: 'enable_chatbot', label: 'Activer Chatbot', type: 'checkbox', defaultValue: false },
                    { name: 'default_chat_language', label: 'Langue du chat par défaut', type: 'text', defaultValue: 'fr' },
                ],
            },
            {
                id: 'system_notifications',
                title: 'Notifications système',
                fields: [
                    { name: 'notify_on_login', label: 'Notifier à la connexion', type: 'checkbox', defaultValue: false },
                    { name: 'notify_on_new_user', label: 'Notifier pour nouveau utilisateur', type: 'checkbox', defaultValue: true },
                    { name: 'notify_on_critical_action', label: 'Notifier pour action critique', type: 'checkbox', defaultValue: true },
                ],
            },
        ],
    },
    {
        id: 'modules',
        title: 'Modules & Fonctionnalités',
        icon: Boxes,
        subsections: [
            {
                id: 'module_activation',
                title: 'Activation de modules',
                fields: [
                    { name: 'enable_visitors', label: 'Module Visiteurs', type: 'checkbox', defaultValue: true },
                    { name: 'enable_sales', label: 'Module Ventes', type: 'checkbox', defaultValue: false },
                    { name: 'enable_reports', label: 'Module Rapports', type: 'checkbox', defaultValue: true },
                    { name: 'enable_statistics', label: 'Module Statistiques', type: 'checkbox', defaultValue: true },
                    { name: 'enable_documents', label: 'Module Documents', type: 'checkbox', defaultValue: true },
                    { name: 'enable_calendar', label: 'Module Calendrier', type: 'checkbox', defaultValue: false },
                    { name: 'enable_api_access', label: 'Accès API', type: 'checkbox', defaultValue: false },
                ],
            },
        ],
    },
    {
        id: 'api',
        title: 'API & Intégrations',
        icon: Plug,
        subsections: [
            {
                id: 'api_config',
                title: 'Configuration API',
                fields: [
                    { name: 'api_enabled', label: 'API activée', type: 'checkbox', defaultValue: false },
                    { name: 'api_rate_limit', label: 'Limite de requêtes par minute', type: 'number', defaultValue: 60 },
                    { name: 'webhook_url', label: 'URL du Webhook', type: 'url' },
                ],
            },
        ],
    },
    {
        id: 'statistics',
        title: 'Statistiques & Logs',
        icon: BarChart3,
        subsections: [
            {
                id: 'logs',
                title: 'Logs',
                fields: [
                    { name: 'enable_logs', label: 'Logs activés', type: 'checkbox', defaultValue: true },
                    { name: 'log_retention_days', label: 'Durée de rétention des logs (jours)', type: 'number', defaultValue: 30 },
                    { name: 'enable_audit_trail', label: 'Piste d\'audit activée', type: 'checkbox', defaultValue: true },
                ],
            },
            {
                id: 'dashboard',
                title: 'Tableau de bord',
                fields: [
                    { name: 'show_dashboard_stats', label: 'Afficher les statistiques', type: 'checkbox', defaultValue: true },
                ],
            },
        ],
    },
    {
        id: 'billing',
        title: 'Facturation (Optionnel SaaS)',
        icon: CreditCard,
        subsections: [
            {
                id: 'billing_config',
                title: 'Configuration de facturation',
                fields: [
                    { name: 'subscription_plan', label: 'Plan d\'abonnement', type: 'text' },
                    { name: 'billing_cycle', label: 'Cycle de facturation', type: 'select', options: [
                        { value: 'monthly', label: 'Mensuel' },
                        { value: 'yearly', label: 'Annuel' },
                        { value: 'quarterly', label: 'Trimestriel' },
                    ] },
                    { name: 'trial_days', label: 'Jours d\'essai', type: 'number', defaultValue: 14 },
                    { name: 'payment_provider', label: 'Fournisseur de paiement', type: 'text' },
                    { name: 'invoice_prefix', label: 'Préfixe de facture', type: 'text', defaultValue: 'INV' },
                    { name: 'tax_rate', label: 'Taux de taxe (%)', type: 'number', defaultValue: 20 },
                ],
            },
        ],
    },
    {
        id: 'technical',
        title: 'Paramètres Techniques Avancés',
        icon: Settings2,
        subsections: [
            {
                id: 'technical_settings',
                title: 'Paramètres techniques',
                fields: [
                    { name: 'maintenance_mode', label: 'Mode maintenance', type: 'checkbox', defaultValue: false },
                    { name: 'debug_enabled', label: 'Debug activé', type: 'checkbox', defaultValue: false },
                    { name: 'cache_enabled', label: 'Cache activé', type: 'checkbox', defaultValue: true },
                    { name: 'performance_level', label: 'Niveau de performance', type: 'select', options: [
                        { value: 'low', label: 'Faible' },
                        { value: 'medium', label: 'Moyen' },
                        { value: 'high', label: 'Élevé' },
                    ] },
                ],
            },
            {
                id: 'custom_code',
                title: 'Code personnalisé',
                fields: [
                    { name: 'custom_css', label: 'CSS personnalisé', type: 'textarea' },
                    { name: 'custom_js', label: 'JavaScript personnalisé', type: 'textarea' },
                ],
            },
        ],
    },
];

function SettingField({ field, errors }: { field: Field; errors: Record<string, string> }) {
    if (field.type === 'file') {
        return (
            <ImageUpload
                name={field.name}
                label={field.label}
                description={field.description}
                accept={field.accept}
                error={errors[field.name]}
            />
        );
    }

    if (field.type === 'checkbox') {
        return (
            <div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Checkbox id={field.name} name={field.name} defaultChecked={field.defaultValue as boolean} />
                        <Label htmlFor={field.name} className="font-normal cursor-pointer">{field.label}</Label>
                    </div>
                    {field.description && (
                        <p className="text-xs text-muted-foreground mt-1 ml-6">{field.description}</p>
                    )}
                    {errors[field.name] && <InputError message={errors[field.name]} className="ml-6 mt-1" />}
                </div>
            </div>
        );
    }

    if (field.type === 'select') {
        return (
            <div className="flex items-start gap-4 py-3 border-b border-border/40 last:border-0">
                <div className="flex-1 min-w-0">
                    <Label htmlFor={field.name} className="text-sm font-normal">
                        {field.label}
                    </Label>
                    {field.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                    )}
                </div>
                <div className="w-64">
                    <Select name={field.name} defaultValue={field.defaultValue as string}>
                        <SelectTrigger id={field.name}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors[field.name] && <InputError message={errors[field.name]} className="mt-1" />}
                </div>
            </div>
        );
    }

    if (field.type === 'textarea') {
        return (
            <div className="flex flex-col gap-2 py-3 border-b border-border/40 last:border-0">
                <Label htmlFor={field.name} className="text-sm font-normal">
                    {field.label}
                </Label>
                {field.description && (
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                <Textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={field.defaultValue as string}
                    rows={3}
                    className="font-mono text-sm"
                />
                {errors[field.name] && <InputError message={errors[field.name]} />}
            </div>
        );
    }

    return (
        <div className="flex items-start gap-4 py-3 border-b border-border/40 last:border-0">
            <div className="flex-1 min-w-0">
                <Label htmlFor={field.name} className="text-sm font-normal">
                    {field.label}
                </Label>
                {field.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                )}
            </div>
            <div className="w-64">
                <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    defaultValue={field.defaultValue?.toString()}
                    className={field.type === 'color' ? 'h-10' : ''}
                />
                {errors[field.name] && <InputError message={errors[field.name]} className="mt-1" />}
            </div>
        </div>
    );
}

export default function Create({ places }: { places: Place[] }) {
    const placeOptions = places.map((place) => ({ value: place.id, label: place.name }));

    const sections = configSections.map((section) => {
        if (section.id === 'organization') {
            return {
                ...section,
                subsections: section.subsections.map((subsection) => {
                    if (subsection.id === 'identity') {
                        return {
                            ...subsection,
                            fields: subsection.fields.map((field) =>
                                field.name === 'place_id' ? { ...field, options: placeOptions } : field
                            ),
                        };
                    }
                    return subsection;
                }),
            };
        }
        return section;
    });

    const [activeSection, setActiveSection] = useState<string>(sections[0].id);
    const [activeSubsection, setActiveSubsection] = useState<string>(sections[0].subsections[0].id);

    const currentSection = sections.find((s) => s.id === activeSection);
    const currentSubsection = currentSection?.subsections.find((ss) => ss.id === activeSubsection);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvelle configuration" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={index().url}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Nouvelle configuration</h1>
                        <p className="text-muted-foreground">Configuration complète de l'application</p>
                    </div>
                </div>

                <Form {...store.form()}>
                    {({ errors }) => (
                        <>
                            <div className="flex flex-1 gap-0 border rounded-lg overflow-hidden bg-background min-h-[600px]">
                                <div className="w-64 border-r bg-muted/30 overflow-y-auto">
                                    <div className="p-4">
                                        <Input
                                            type="search"
                                            placeholder="Rechercher un paramètre..."
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <nav className="pb-4">
                                        {sections.map((section) => {
                                            const Icon = section.icon;
                                            return (
                                                <div key={section.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveSection(section.id);
                                                            setActiveSubsection(section.subsections[0].id);
                                                        }}
                                                        className={`w-full text-left px-4 py-1.5 text-sm font-medium hover:bg-accent/50 transition-colors flex items-center gap-2 ${
                                                            activeSection === section.id ? 'text-foreground' : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                                        <span>{section.title}</span>
                                                    </button>
                                                    {activeSection === section.id && (
                                                        <div className="ml-4 border-l border-border/40">
                                                            {section.subsections.map((subsection) => (
                                                                <button
                                                                    key={subsection.id}
                                                                    type="button"
                                                                    onClick={() => setActiveSubsection(subsection.id)}
                                                                    className={`w-full text-left px-4 py-1 text-xs hover:bg-accent/50 transition-colors ${
                                                                        activeSubsection === subsection.id
                                                                            ? 'text-foreground font-medium bg-accent/30'
                                                                            : 'text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {subsection.title}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </nav>
                                </div>

                                <div className="flex-1 overflow-y-auto">
                                    <div className="p-6 max-w-4xl">
                                        <div className="mb-6">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                <span>{currentSection?.title}</span>
                                                <ChevronRight className="h-3 w-3" />
                                                <span>{currentSubsection?.title}</span>
                                            </div>
                                            <h2 className="text-lg font-semibold">{currentSubsection?.title}</h2>
                                        </div>

                                        <div className="space-y-0">
                                            {currentSubsection?.fields.map((field) => (
                                                <SettingField key={field.name} field={field} errors={errors} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 border-t pt-4">
                                <Button type="submit">
                                    Créer la configuration
                                </Button>
                                <Link href={index().url}>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
