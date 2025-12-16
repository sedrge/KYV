<?php

return [
    // 1. Informations Générales
    'organization_name' => 'Nom de l\'organisation',
    'organization_short_name' => 'Organisation',
    'slogan' => 'Votre slogan ici',
    'description' => 'Description de votre organisation',
    'type_organisation' => 'Entreprise',
    'secteur_activite' => 'Général',

    // Coordonnées
    'email_principal' => 'contact@exemple.com',
    'telephone_principal' => null,
    'telephone_secondaire' => null,
    'adresse' => null,
    'ville' => null,
    'pays' => null,
    'site_web' => null,

    // 2. Thème & Apparence (Design par défaut - Bleu professionnel)
    'primary_color' => '#1E3A8A',
    'secondary_color' => '#3B82F6',
    'accent_color' => '#60A5FA',
    'success_color' => '#10B981',
    'warning_color' => '#F59E0B',
    'danger_color' => '#EF4444',
    'background_color' => '#F9FAFB',
    'text_color' => '#1F2937',

    // Typographie - Arial, clean et moderne
    'font_family' => 'Arial, sans-serif',
    'font_size_base' => '16px',
    'font_size_title' => '24px',
    'font_weight' => '400',

    // Layout
    'layout_type' => 'sidebar',
    'sidebar_position' => 'left',
    'sidebar_collapsed_by_default' => false,
    'border_radius' => '0.5rem',
    'shadow_style' => '0 1px 3px 0 rgb(0 0 0 / 0.1)',

    // Sidebar styling
    'sidebar_header_bg' => null,
    'sidebar_header_text' => null,
    'sidebar_header_font_family' => null,
    'sidebar_header_font_size' => null,
    'sidebar_menu_bg' => null,
    'sidebar_menu_text' => null,
    'sidebar_menu_font_family' => null,
    'sidebar_menu_font_size' => null,
    'sidebar_footer_bg' => null,
    'sidebar_footer_text' => null,
    'sidebar_footer_font_family' => null,
    'sidebar_footer_font_size' => null,

    // Navbar styling
    'navbar_bg' => null,
    'navbar_text' => null,
    'navbar_border' => null,

    // 3. Navigation & Structure
    'show_sidebar' => true,
    'sidebar_items' => [],
    'sidebar_icon_style' => 'outline',
    'show_icons_only' => false,
    'custom_sidebar_html' => null,
    'show_header' => true,
    'header_type' => 'fixed',
    'header_background_color' => '#FFFFFF',
    'custom_header_html' => null,
    'show_footer' => true,
    'footer_text' => '© 2025 - Tous droits réservés',
    'footer_links' => [],
    'footer_background_color' => '#F9FAFB',

    // 4. Sécurité & Authentification
    'enable_registration' => true,
    'require_email_verification' => false,
    'require_phone_verification' => false,
    'enable_2fa' => false,
    'password_min_length' => 8,
    'password_require_special_char' => true,
    'password_require_number' => true,
    'session_timeout_minutes' => 120,
    'max_login_attempts' => 5,
    'lock_account_after_failures' => true,
    'roles_enabled' => true,
    'permissions_customizable' => true,
    'default_role_on_register' => 'user',

    // 5. Préférences Utilisateur
    'allow_avatar_upload' => true,
    'default_language' => 'fr',
    'timezone' => 'UTC',
    'date_format' => 'd/m/Y',
    'time_format' => 'H:i',

    // 6. Langue & Localisation
    'available_languages' => ['fr', 'en'],
    'currency' => 'EUR',
    'currency_position' => 'after',
    'number_format' => '0,00',
    'first_day_of_week' => 1,

    // 7. Documents & Contenu
    'allowed_file_types' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],
    'max_file_size' => 10240,
    'auto_generate_reference' => true,
    'document_prefix' => 'DOC',
    'storage_location' => 'local',
    'custom_pages' => [],
    'terms_and_conditions' => null,
    'privacy_policy' => null,

    // 8. Notifications & Communications
    'mail_driver' => 'smtp',
    'mail_host' => null,
    'mail_port' => 587,
    'mail_from_name' => 'Nom de l\'organisation',
    'mail_from_address' => 'noreply@exemple.com',
    'mail_signature' => null,
    'enable_sms' => false,
    'enable_whatsapp' => false,
    'enable_chatbot' => false,
    'default_chat_language' => 'fr',
    'notify_on_login' => false,
    'notify_on_new_user' => true,
    'notify_on_critical_action' => true,

    // 9. Modules & Fonctionnalités
    'enable_visitors' => true,
    'enable_sales' => true,
    'enable_reports' => true,
    'enable_statistics' => true,
    'enable_documents' => true,
    'enable_calendar' => true,
    'enable_api_access' => false,
    'module_settings' => [],

    // 10. API & Intégrations
    'api_enabled' => false,
    'api_rate_limit' => 60,
    'webhook_url' => null,
    'webhook_events' => [],
    'external_services' => [],

    // 11. Statistiques & Logs
    'enable_logs' => true,
    'log_retention_days' => 90,
    'enable_audit_trail' => true,
    'show_dashboard_stats' => true,
    'dashboard_widgets_config' => [],

    // 12. Facturation (Optionnel SaaS)
    'subscription_plan' => null,
    'billing_cycle' => null,
    'trial_days' => 0,
    'payment_provider' => null,
    'invoice_prefix' => 'INV',
    'tax_rate' => 0,

    // 13. Paramètres Techniques
    'maintenance_mode' => false,
    'debug_enabled' => false,
    'cache_enabled' => true,
    'performance_level' => 'medium',
    'custom_css' => null,
    'custom_js' => null,
];
