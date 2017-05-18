{
  "@context": "http://iiif.io/api/presentation/2/context.json",
  "@id": "{{ uri }}",
  "@type": "sc:Manifest",
  "label": "{{ label }}",
  "attribution": "Individual images belong to their owners.",
  "description": "Manifest created on the fly with local files.",
  "license": "https://creativecommons.org/publicdomain/zero/1.0/",
  "metadata": [
    {
      "label": "Author",
      "value": "Mirador Desktop"
    }
  ],
  "viewingDirection": "left-to-right",
  "viewingHint": "individuals",
  "sequences": [
    {
      "@id": "{{ uri }}/sequence",
      "@type": "sc:Sequence",
      "canvases": [{{#each files}}
        {
          "@type": "sc:Canvas",
          "@id": "file://{{ this.file }}/canvas",
          "label": "{{ this.file }}",
          "thumbnail": {
            "@id": "file://{{ this.file }}"
          },
          "height": {{ this.dimensions.height }},
          "width": {{ this.dimensions.width }},
          "images": [
            {
              "@type": "oa:Annotation",
              "@id": "file://{{ this.file }}/anno",
              "motivation": "sc:painting",
              "resource": {
                "@id": "file://{{ this.file }}",
                "@type": "dcterms:Image",
                "format": "{{ this.mime }}",
                "height": {{ this.dimensions.height }},
                "width": {{ this.dimensions.width }}
              },
              "on": "file://{{ this.file }}/anno"
            }
          ]
        }{{#unless @last}},{{/unless}}{{/each}}
      ]
    }
  ]
}
