<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'place_id' => ['nullable', 'uuid', 'exists:places,id'],

            // 1. Informations Générales
            'organization_name' => ['nullable', 'string', 'max:255'],
            'organization_short_name' => ['nullable', 'string', 'max:100'],
            'slogan' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type_organisation' => ['nullable', 'string', 'max:100'],
            'secteur_activite' => ['nullable', 'string', 'max:100'],
            'email_principal' => ['nullable', 'email', 'max:255'],
            'telephone_principal' => ['nullable', 'string', 'max:20'],
            'telephone_secondaire' => ['nullable', 'string', 'max:20'],
            'adresse' => ['nullable', 'string'],
            'ville' => ['nullable', 'string', 'max:100'],
            'pays' => ['nullable', 'string', 'max:100'],
            'site_web' => ['nullable', 'url', 'max:255'],
            'logo_light' => ['nullable', 'file', 'image', 'max:2048'],
            'logo_dark' => ['nullable', 'file', 'image', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png', 'max:512'],
            'background_login' => ['nullable', 'file', 'image', 'max:5120'],
            'background_dashboard' => ['nullable', 'file', 'image', 'max:5120'],

            // 2. Thème & Apparence
            'primary_color' => ['nullable', 'string', 'max:50'],
            'secondary_color' => ['nullable', 'string', 'max:50'],
            'accent_color' => ['nullable', 'string', 'max:50'],
            'success_color' => ['nullable', 'string', 'max:50'],
            'warning_color' => ['nullable', 'string', 'max:50'],
            'danger_color' => ['nullable', 'string', 'max:50'],
            'background_color' => ['nullable', 'string', 'max:50'],
            'text_color' => ['nullable', 'string', 'max:50'],
            'font_family' => ['nullable', 'string', 'max:100'],
            'font_size_base' => ['nullable', 'string', 'max:20'],
            'font_size_title' => ['nullable', 'string', 'max:20'],
            'font_weight' => ['nullable', 'string', 'max:20'],
            'layout_type' => ['nullable', 'string', 'in:sidebar,topbar,mixed'],
            'sidebar_position' => ['nullable', 'string', 'in:left,right'],
            'sidebar_collapsed_by_default' => ['nullable', 'boolean'],
            'border_radius' => ['nullable', 'string', 'max:20'],
            'shadow_style' => ['nullable', 'string', 'max:50'],

            // Sidebar styling
            'sidebar_header_bg' => ['nullable', 'string', 'max:50'],
            'sidebar_header_text' => ['nullable', 'string', 'max:50'],
            'sidebar_header_font_family' => ['nullable', 'string', 'max:50'],
            'sidebar_header_font_size' => ['nullable', 'string', 'max:20'],
            'sidebar_menu_bg' => ['nullable', 'string', 'max:50'],
            'sidebar_menu_text' => ['nullable', 'string', 'max:50'],
            'sidebar_menu_font_family' => ['nullable', 'string', 'max:50'],
            'sidebar_menu_font_size' => ['nullable', 'string', 'max:20'],
            'sidebar_footer_bg' => ['nullable', 'string', 'max:50'],
            'sidebar_footer_text' => ['nullable', 'string', 'max:50'],
            'sidebar_footer_font_family' => ['nullable', 'string', 'max:50'],
            'sidebar_footer_font_size' => ['nullable', 'string', 'max:20'],

            // Navbar styling
            'navbar_bg' => ['nullable', 'string', 'max:50'],
            'navbar_text' => ['nullable', 'string', 'max:50'],
            'navbar_border' => ['nullable', 'string', 'max:50'],

            // 3. Navigation & Structure
            'show_sidebar' => ['nullable', 'boolean'],
            'sidebar_items' => ['nullable', 'array'],
            'sidebar_icon_style' => ['nullable', 'string', 'max:50'],
            'show_icons_only' => ['nullable', 'boolean'],
            'custom_sidebar_html' => ['nullable', 'string'],
            'show_header' => ['nullable', 'boolean'],
            'header_type' => ['nullable', 'string', 'in:fixed,static'],
            'header_background_color' => ['nullable', 'string', 'max:50'],
            'custom_header_html' => ['nullable', 'string'],
            'show_footer' => ['nullable', 'boolean'],
            'footer_text' => ['nullable', 'string'],
            'footer_links' => ['nullable', 'array'],
            'footer_background_color' => ['nullable', 'string', 'max:50'],

            // 4. Sécurité & Authentification
            'enable_registration' => ['nullable', 'boolean'],
            'require_email_verification' => ['nullable', 'boolean'],
            'require_phone_verification' => ['nullable', 'boolean'],
            'enable_2fa' => ['nullable', 'boolean'],
            'password_min_length' => ['nullable', 'integer', 'min:4', 'max:32'],
            'password_require_special_char' => ['nullable', 'boolean'],
            'password_require_number' => ['nullable', 'boolean'],
            'session_timeout_minutes' => ['nullable', 'integer', 'min:1'],
            'max_login_attempts' => ['nullable', 'integer', 'min:1'],
            'lock_account_after_failures' => ['nullable', 'boolean'],
            'roles_enabled' => ['nullable', 'boolean'],
            'permissions_customizable' => ['nullable', 'boolean'],
            'default_role_on_register' => ['nullable', 'string', 'max:50'],

            // 5. Préférences Utilisateur
            'allow_avatar_upload' => ['nullable', 'boolean'],
            'default_language' => ['nullable', 'string', 'max:5'],
            'timezone' => ['nullable', 'string', 'max:50'],
            'date_format' => ['nullable', 'string', 'max:50'],
            'time_format' => ['nullable', 'string', 'max:50'],

            // 6. Langue & Localisation
            'available_languages' => ['nullable', 'array'],
            'currency' => ['nullable', 'string', 'max:3'],
            'currency_position' => ['nullable', 'string', 'in:before,after'],
            'number_format' => ['nullable', 'string', 'max:50'],
            'first_day_of_week' => ['nullable', 'integer', 'min:0', 'max:6'],

            // 7. Documents & Contenu
            'allowed_file_types' => ['nullable', 'array'],
            'max_file_size' => ['nullable', 'integer', 'min:1'],
            'auto_generate_reference' => ['nullable', 'boolean'],
            'document_prefix' => ['nullable', 'string', 'max:10'],
            'storage_location' => ['nullable', 'string', 'in:local,s3,cloud'],
            'custom_pages' => ['nullable', 'array'],
            'terms_and_conditions' => ['nullable', 'string'],
            'privacy_policy' => ['nullable', 'string'],

            // 8. Notifications & Communications
            'mail_driver' => ['nullable', 'string', 'max:50'],
            'mail_host' => ['nullable', 'string', 'max:255'],
            'mail_port' => ['nullable', 'integer'],
            'mail_from_name' => ['nullable', 'string', 'max:255'],
            'mail_from_address' => ['nullable', 'email', 'max:255'],
            'mail_signature' => ['nullable', 'string'],
            'enable_sms' => ['nullable', 'boolean'],
            'enable_whatsapp' => ['nullable', 'boolean'],
            'enable_chatbot' => ['nullable', 'boolean'],
            'default_chat_language' => ['nullable', 'string', 'max:5'],
            'notify_on_login' => ['nullable', 'boolean'],
            'notify_on_new_user' => ['nullable', 'boolean'],
            'notify_on_critical_action' => ['nullable', 'boolean'],

            // 9. Modules & Fonctionnalités
            'enable_visitors' => ['nullable', 'boolean'],
            'enable_sales' => ['nullable', 'boolean'],
            'enable_reports' => ['nullable', 'boolean'],
            'enable_statistics' => ['nullable', 'boolean'],
            'enable_documents' => ['nullable', 'boolean'],
            'enable_calendar' => ['nullable', 'boolean'],
            'enable_api_access' => ['nullable', 'boolean'],
            'module_settings' => ['nullable', 'array'],

            // 10. API & Intégrations
            'api_enabled' => ['nullable', 'boolean'],
            'api_rate_limit' => ['nullable', 'integer', 'min:1'],
            'webhook_url' => ['nullable', 'url', 'max:255'],
            'webhook_events' => ['nullable', 'array'],
            'external_services' => ['nullable', 'array'],

            // 11. Statistiques & Logs
            'enable_logs' => ['nullable', 'boolean'],
            'log_retention_days' => ['nullable', 'integer', 'min:1'],
            'enable_audit_trail' => ['nullable', 'boolean'],
            'show_dashboard_stats' => ['nullable', 'boolean'],
            'dashboard_widgets_config' => ['nullable', 'array'],

            // 12. Facturation (Optionnel SaaS)
            'subscription_plan' => ['nullable', 'string', 'max:100'],
            'billing_cycle' => ['nullable', 'string', 'in:monthly,yearly,quarterly'],
            'trial_days' => ['nullable', 'integer', 'min:0'],
            'payment_provider' => ['nullable', 'string', 'max:50'],
            'invoice_prefix' => ['nullable', 'string', 'max:10'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],

            // 13. Paramètres Techniques
            'maintenance_mode' => ['nullable', 'boolean'],
            'debug_enabled' => ['nullable', 'boolean'],
            'cache_enabled' => ['nullable', 'boolean'],
            'performance_level' => ['nullable', 'string', 'in:low,medium,high'],
            'custom_css' => ['nullable', 'string'],
            'custom_js' => ['nullable', 'string'],
        ];
    }
}
