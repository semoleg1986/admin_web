import type { LocaleCode } from '~/shared/lib/preferences/types';

export const MESSAGES: Record<LocaleCode, Record<string, string>> = {
  ru: {
    "app.name": "Curs Admin",
    "page.hero.title": "Панель администратора образовательной платформы",
    "page.hero.subtitle": "Управление доступами, платежами, контентом и аналитикой.",
    "page.status": "Статус API",
    "status.ok": "работает",
    "status.degraded": "нестабильно",
    "catalog.title": "Курсы под контролем",
    "catalog.empty": "Курсы скоро появятся.",
    "catalog.level": "Уровень",
    "catalog.lessons": "Уроков",
    "catalog.level.beginner": "Начальный",
    "catalog.level.intermediate": "Средний",
    "catalog.level.advanced": "Продвинутый",
    "catalog.level.unknown": "Без уровня",
    "settings.title": "Настройки интерфейса",
    "settings.subtitle": "Выберите язык и тему оформления для панели администратора.",
    "settings.language": "Язык",
    "settings.theme": "Тема",
    "settings.theme.system": "Системная",
    "settings.theme.light": "Светлая",
    "settings.theme.dark": "Темная",
    "footer.settings": "Настройки",
    "footer.copyright": "Все права защищены."
  },
  en: {
    "app.name": "Curs Admin",
    "page.hero.title": "Administration console for the learning platform",
    "page.hero.subtitle": "Manage access, payments, content and analytics.",
    "page.status": "API status",
    "status.ok": "healthy",
    "status.degraded": "degraded",
    "catalog.title": "Courses under supervision",
    "catalog.empty": "Courses are coming soon.",
    "catalog.level": "Level",
    "catalog.lessons": "Lessons",
    "catalog.level.beginner": "Beginner",
    "catalog.level.intermediate": "Intermediate",
    "catalog.level.advanced": "Advanced",
    "catalog.level.unknown": "Unspecified",
    "settings.title": "Interface settings",
    "settings.subtitle": "Choose language and color theme for the admin console.",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.theme.system": "System",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "footer.settings": "Settings",
    "footer.copyright": "All rights reserved."
  }
};

export function translate(locale: LocaleCode, key: string): string {
  return MESSAGES[locale][key] ?? MESSAGES.ru[key] ?? key;
}
