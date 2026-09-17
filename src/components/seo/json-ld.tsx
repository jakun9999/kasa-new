/**
 * Injecte un objet JSON-LD dans le HTML (Server Component).
 * Invisible pour l’utilisateur ; lu par les crawlers / validateurs Schema.org.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
