/// <mls shortName="pluginNewFileService" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewFileService",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "internal",
      "service"
    ]
  },
  "references": {
    "widgets": [
      "wc-code-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "shortName",
      "project",
      "position",
      "loading"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_utilsLit",
      "./_100554_stateLitElement",
      "./_100554_collabLitElement",
      "./_100554_collabDecorators",
      "./_100554_serviceBase",
      "./_100554_pluginNewFileBase",
      "./_100554_wcCode"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza apenas elementos básicos (div, h2, hr, span, button) e um widget customizado (wc-code-100554).",
      "O botão de criação é acessível via teclado (elemento <button>), mas não há atributos aria-* explícitos.",
      "Não há tabindex customizado, mas o fluxo padrão de foco está preservado.",
      "O contraste de cores parece adequado devido ao uso de tokens de cor, mas recomenda-se validação visual para garantir acessibilidade total.",
      "Sugestão: adicionar atributos aria-label ou aria-live para feedback de carregamento e erros, se necessário."
    ],
    "i18nWarnings": []
  },
  "embedding": "eJwlmHdcjt8bx80QaZERqUhKiob0nOtkZmSvJDL72tk7oy2KVEqSkj0iofWc65BZITIyEpK9t68v4nedfn94edXTfT/3fY3P5/05zer0kutt7XlSGYe/vxvAuJbDmHfLlnJDx0D0K9KRHnIqW1MyVpu/uUo0r7tFLFiGGnz6mfmbe3JTnWRe+LqG1BlZgQn2J1h8aC1ufrw9v+ieLttPNIM9D6PQpI41fN/1Bsc0/44194/WBndI0Tb02g9WJ4qgVaaZTHCoy2Pt7okJBYbwOJnhQot37NmO3qz8Y2ewmhiCOU/T8MeP+XLng1BYs8qYDzG5LFqNDxe7y2dA1O0dXET7iO2dO3Cvc76YtakVD77hJDyMfoO74SlcGzBe/NzjIT1Or9MOaNoBz8feyXvtuZPrjHLE7/9F4c3E7bB0RRe5x3EkpIYtlcuumYo723ZD35nd2GEXF1hUfAaOVcYwfe8g6Zl/CEzrXhKp4YUYdP0xxoXEa9vVL8irUdVOds6ty3sZ9ZUlPRbKcy9GSb9FOTimRaG0adhY9m+6Eek5UTOtrly8bCEUvTaVdB/oP8uKLSymWr2Kk855G8XYC8mwtHgZ/zxoILduMFRW/WqFEbZxaHw0DZymtnVdfDUOLvUIx5I390TYmraYu+kG9Sec2U9aBjHBHXhx/Cj+d7glGzdvBo+y9YOtZfVwtkWQHHEuCs9ADqsalgUXXnzADbcesuu9ErBpxiZhdFSHU31li2MJ6DX3Aj3bdrY5eCNcijfDvE3v0Kh2KkwqsJPfd83mWzr1lQn2TjwnugG//+Ecq+w7h4evfqtpqROEDf5ew4POhUzV075RFxl2U1R/T49pn7TJZd7SZ14xc9U2lQst/OXcKymudpPjWEXf67j1ngu78GIe7H94FsPW7BaXe1jwS1uuwPfBI/FyjzSIDmI4+vwWaZd9GDbY/Av5zwfJz/8ex0DrTFh+1Q8HNwvGWZf6wID8aLSf9C8U92zMA0ra4vMdD9k8ywZqbuFQZKi80fMR3t3mDq++rcMPg+LRf+lJsd72KPv5n6+WiR2QVj4YksokPEtpKi/yMph4sYytuNZVtvJZTdfUkzUORLE11ztC5Q492TnHiXXJXiX2RkiM7XRYHFpfgVMLnbHDRDdeNfQJo/eHO+9eiX+K0sCrRSeYe8WMTVvcjluf7Ape5x5oImyNwd1gDvecbQTWE17gtMLXcONtX15nxCI0HrsefwyNxbTyYshy/YXuuBeWW+lQr0fIszGzcGKrQ5hy3wPd/B6Lsy/ytGkR63Bjx644vQhFbvQejLP7CgWvjrL0R8/Ab5FrHs0UWk+YDq5Tv8L7NCO+fKUZ/zW0EJYun8h3PUgFv4XPtG0yb4Hn6btgp/vZDaaZ48w2Z1HNcFTpQPix+65mldUY/LZ7F0wz0/DaVT48veu63GSHT9rv/zXiy63CRTe/i3BiU03ofaolzm7zAA9tcMQvu7LAa66H7Dp1LD8b85qVJ/UVyWH5qPbydp+Gkq7hJ5+0YIPyPZBmDv2v1JYdszfz4h7AWhwzgZFzo+W8ZRZIcwe33p0AqrWwPTkHsp44y9mLv4FL455y5bXrYJaZhwuu3IJfQ77jWRgBXvOaIb0nWtZPxxlLYsCwZgBYZ9WXtBuyy5RsHHR6kaz1JwZiOm2G0ed6wQHnI5h83xZmmTeRR6Oi4MPO+/ig73aYs3QbvB2ox0t6nmcSgvDNgFfocSqL/fezify0qyV31T8KHsZXme+C/aRLdZjXvK1qn5GemU9pVYHm9Q2lYe1Qdn/bV3Y6xpmnhvcXSu/S7gfI671M+NUed9hwf0uYVjgLu0/vIH/9qilHNc8Xqs8BK0eB6pteTVv8Mrg1P+IyTPYyuqhmB4Otr2C2W6oo7oGw2LIMyzyM6X8f9uHbIuxl3FxT5F7JfC7kYMlWYxg46z4+6W8g3fwm5zVOtwOqB/v0vQItfG2g54x4N9JPQbXFlQGRghvuFvucjbi+d01O+wyWJ+LcVlndwaMubxjVj/3eVwdVvf3MUoHqxSM7moLSjqDVprLIfQp4zNyBA5rcxri7nThdk1P7wFnUPbwHav0x5KTN8PYblxsDh/ALcQdxhZUFL4pbmfd32DCmje4u//zKwfMv20vS/+r50Gr2K73jrnm95c3eIfK1pznc7bMP6h/8h9PcQo2qPagzOlSWecQh9UlQ/Xn6hmJYc/0w/N2nxbepI2XMnXy4lnCG/x1WgqNaxGL/0xJNfAxlh4l5LHT1cCxL6ij1a22F2lVlOHlhBgZ3MFPzJg8+ygDyKUG9xlcDhqDF8Z7yUd9sbapjLUnfzUoTs9m6WweA9IhnPw3H5StT+Pu0WN4swwbi77WUIWsi4NPgWrxdgxao7/UAyGdA6WPN3/5o5bsSB5t0RtIDeS5uk3ATwWxVwD48F4ugvI18UK6+vhmpf5Be4epOO5zX91SJIG+Bex868Ipkc3je/2Le5EVBPDFkGhp6Jwu7ycby9dcSfPG1pZyyYLkIbr8Sw1fPwSNdLSX1WD7c7sS3OQh4ndpNLCruyWwntZdtj5dDRtR+HDInCeYu0wHyJfXMWOdPOqN+Ic0sVvZz5w8/XhbkJfj5X0dYt3YztB5vwWkelSbhiHON0KjWYIiyfSqd9EZh71NJOMr/Lrbw6SdXrsxj5Jk4a0m63Go/BCLWHgbydJxuVspIR5SnsamLWvFM10Ns49pVMH5BI3a4IhlmLbFD5Zd0LQS0ew1tT9hz2j15sttxiLwdjHX/FOCf4fWYj2k9TlwBI5pbyUMPf4D26RikuivNZO88b+dOXHAWuxsZSNJTmtVDEH+3EJWvKE1T2kbeg/QdnLxNMMMIpL1kNIt43t1Q0HtL8lLiiGTxJNkLaF9IhwNkp0YJEG7THmyy2gob3f9rVHJYDzzyeD1WePyFqNLLGGoTCfGdJmPNkfqaDpMi2chz1vJlymUteTQOa9ZNGtd6idvCNsAwk2lIsyOoT1rlLdndipUfAfmuMBs3i8fdGYfzLUZIN+0xjFgzFgpelouMyFJ0N3jL9q23laSB6nOWGdULG9TYJbKf6oDuaC3YZrmj2sNMV1vY6ziXmXj7w6uvLrjFPhF6TX8ojGoV57oZmEprXQtsMx747Msmiu1wbMss0VrHlZHmctJ1xUw4vPkGpJ0n7XXiuyN2aRMddor9TuNA9+9rfDfwANt+P5o55cxkxE0ib5M/Km/WaqwlMRhfvuIK8U5rJJ5i7SdcYYotSt/+hnu956GaDeVj5N1A95PMoCuf3cYXprWJgjTH1pw8nDWv2wTUHNH1SM+kdgjHX2wHVcNc5IhmN2mHjrFRZ+drfg1ZinsflKrdYZEdt9Mz65KvPQL9MQ48q7IS/ymy0ISszqY52Qu6XlGM/AnKky6CNvo0o3oy4lJ59Y075Lpp6V1DxfMBzZE0HYgbOHEYOx7li/QZS7o3G/0W/oPjTHdhVFAYKg67GNcHFhbvg6AOIeJ0zEm82bu2Nqtyiuyoe4fde3+bKUYKuTEEUsq3wueBK5hj7k61k0qvOfWGmPSCsNZNQ+Ij+Lv3Jc1HLijWNkyfAiPmvBGkszjv8nT1GQS0b6z8GeXzBBzbYio0zWgs0x/9A8o/riX0VHwgm/ukC2IeVJy9ur0NI8bCVuN1OKCuCLu1EbxbJvH+TfVEzREciF0gnz3DG70yGc2keL+zh9zucJtY5Qjms39QaM4K6pmgfYHe+B3vvBdYui1CMZTQ9WrErepXAs2JJm1dlpoRRhoKRd1P4ptvljDkzHGgforZ5g5KS5HYCAxqHRfxocE4pdUkVL0mzdDe9ziqeelZVzY9iuzUs0fVPB3QflP1++qnF8AbTwHm4+8A/V55OqwvjdfQzgvSpuq9Twx5rj3u6sEcpwyHZe2cUedvCyAWBLofSqjJX6TWksrb1PyT5wrVK8fGkbn6Xr5ceUvQqgFK04gju6B9TqJm670s4TO/Dc3sd/K4NnKfcyzTG9MEQH8tnuenobfsr6FnyvOdXypoNxjtkzbx7h9Bda/2RdJh/vBTa9mnSV2ZGfmReLYXKt0++7IhRNoOgB1dmuKg/AtIf6NmB78Oeg4OU0zlbifdao+432e8fPalkzA+cg0SQgZCxWddqjvDmOADSDsP04sA11onYLTdbjDNrC3Pwg0gXoC1JYvxeGU6i7NbTMx8E1z05gmlqW76RWh1cjvdt7w6e5163gUCbyTi991SLG23TTE9EusiabzqHfVzAezscllDOUX83LsVJ7duBh0bHiQm5ujbSl9OKWxBLLID/VoXI3F/ntzcr3pXYu3Gyr0P99POZSD5n1CMSTMsiEVgcP4kUH2gnCKUhuJmO0wON+KUf7CAL+EfBjXFjtkGvM7IC0A8Ub0PNhNHQZ2RHkrn1Q4DPl0o7yUZ4OzFS2gWlyJpHOQ8ucaIPUTFx+fgIZ/kUk+APA7P8AZIWQ+I/UDxSuK9ElB1WlVyCqIDZ8qke29wyQoTmNx6K5tQEIOe+bauOU8thOKvDpMa4pjzGZDRlYu1q+ylhe9BRpyESmvVzJBOQsnbjtjh5HWICfLiKhvZZ1/UEn+yDNdorNyxUUt5RSy5ehTr11inXX3dgKv9oz0Tii9MfGKwbxNzUOzZb5Yu9553nFFGY8TEjGrH3n+7Cwed+4Nd1j3mjlZAuUModl0d0JPPs3AF2lUgfmDk0/Jj2hHY5ZirXRtQjqSBqi5A3qWyntJnYXjEmb/4miT2OeVDzO33GHrTXC5umw4vvhTivfdeONAkHp2nnsKhzXaw7Z0PYK2q04K4l1G2hDa+jSVppOadpxfkPUXoKTvBz/8eMDUPNKNsX4Q3eM8PZRdengHJMsjX/UExKXGacNW35yc2OiBlZTbO1JL9/d2AEbdUe7qbwXagDE48upn2rTnlqiog3iDfHMhuJ15nT7/EinYTMlXer85gygNV39aXNtWYHB2DK0oihMp9KZ0naM67x2BF3+H8QMQi9WyKoyDE+gV2amSCcy53waJXRTQL67GHNIJbW58qbtQqTajaO1hSDkLSP5URIPauEQ9cHaihfoLqJXkMozlyq31wi+JeTHUMxk1BO4G0DGNuzwUznRGcsgssXZHJDNMrkXqEKu/lb66i+8UKlfEL+DdGuUfQ/GDaOhdivp+Mek282BEp/+Kt3ilKY7Cf8Uz8PsRKQ3kSiLHAc1a+qH8oh/QLiKGPUG75hadfhCBlMkbchvMt98C5F7eIV33wU1ohhNo0xJcDTogC9wKxaLkN7ix3FC5+m6HiUzfM6faSzTSbLyYubCLJV9jpF7WZZb0yNPLOAb/Wg7naMfspgfBz6BHlC+xEZYEb1ZwTJwvf+aMFZf88yspy9FxbVLOa5riDUUagzPqWnnkvftldT97qNUj77MuRPGIgSO9aD1WWDGg3Cy/Fp4Bjrjmo3STd1JKnwobA5jBuvhaIoYgtymFlQENeq6q7yvWs7qEg3HQ7lyl+KX1vLldcy2YZUdaKs4iba+ZdfhOhVTPaMmOipF7jlMJtsC1MV7r4GZC/OPDZ5hnC98I74thwbHVskKZhDQ5Ku4nxKWdG4jD/epL6qXyBgXaaykgqZyuvxV8/HcgDDHDm4jKm5udYpSHvrGeGRXE/4URlP17+8RjQz9BaJ4ctWxkC/ldCYPcDDWl5vLbi4zSqXUv+bcgGUOxI764yJCOGp77VxofbT6i9ZMo/Ctz78WVXB2hqHIgC6gcy0RrGnHcA4jDpcboez4gcrTkUWUfeSPhX0FwJtdvKK2h2NR8G9kaqJ3YzCMSXKQPVuQbcTDSVq1fOQ3WGs8+pB6eMjDMWn6b3v8Lcp+tpSKvE4uV9gHYVKUeybn59WZ5bKexdry8pz6t3Jl05o87X2CnND0wKvclOPP7GdEZOYlMW/IAaBxrJxunpGHijOVr69sHQDnnaA+svMJX9v/5IhfzYcCRfYzSPuYPObCXW3oyhq/5i84zzIiW8k9i5LgmVLqy3ParO94BqJChrKIYAlXOrNc/rQZ7x2AbyWk8bvtGuPh5xKcG8p6DODNRZFiSFWQH9PWryVqB4ZkNZ4CijDFC9H83G+mAfYycMX3MKLev5CNphpFkkLfAFmmFtllsd6X/pJzrquaE6h1F+Qz4iaFdF50ZX8GnyAgCRK2ieoU3mKHbfwx6959eRgdcvQtgtPWl2PJIpHlIMoriMtEqQT0j36RuhcEsX1RfQG/0R649OpT37qHRTeR8fMqcl65zjVM2b7SeaMfImxXcaqheAwXA3V208Za0w9DXljHyGfPStqLm/VONvkQxqRtQzCNZEUlaCDFd9IFZHtd9XEiJZbKfDaH2yq1DZod2ELlA9L+8SVa6T9DN//XWY9nilHRB34sizpeB93hM9ZxupWeSvvmbR3EyQiQ7mUm4uEEObtZbqzGns3F+Y7vxHC7gB9UbPZx5Gq5CyDf8zfB1Q7uXkx3AqpoUgTQGfC67kDZuUdkJk6THYYLMM16wyll3146BLzlUkr0eVFUm32Iw21rxzbhg+TK6r8ijMWNxd/PjxkVGeJm1JqT6zBO1zRjvAKHdI0kLS6GeUnR6Dc+N9SKwHpPUsOvAVdpkaUc3TSaEjq+dHnU+SNyi/giL3KVjccxM29NqPV15fh9uJw4F0EBUnUh4Qiu2z3EKRtBALXwcqvYHxF/fgpjsbBOkpJpd5a/772QQ766WojMoeeAwA2inY+9Ca6x7eg+o7HiQ9BrNMN1VTJI5VOksa1RXoH6Pn1BIPCPJxdMp5JfoZv8KNa3+Th4/lTWprBWVTdBc3tUlhe5md7kI23H+XdkW7a26k66JgS4JWZTCbrN1AWQpFtE/1nh92yao+q/ArqMJufhfZmdg00aROFDhMLoJ1NmcgJfwIEDsz5e2Ug8Fzdiw0rCEFsTSkdH4o+DRBWbg+XuqhI1VtlQ4FWw9CdSZBmVZd67bQsrtQ3Pjjx3zFzfg/LqG7AA==",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    