import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
    console.log('>>> getRequestConfig called with locale:', locale);
    // Validate that the incoming `locale` parameter is valid
    const locales = ['tr', 'en'];
    if (!locale || !locales.includes(locale as any)) {
        console.log('>>> Invalid locale, defaulting to tr');
        locale = 'tr';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});

