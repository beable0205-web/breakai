import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://getbreakai.com'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/hub`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }
    ]
}
