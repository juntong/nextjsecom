import React, { useState } from 'react'
import { InferGetStaticPropsType } from 'next/types'
import { Disclosure, RadioGroup, Tab } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/solid'
import { HeartIcon, MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline'
import { Product, ProductData, ProductAttributes, ImageData } from '../../types/Product'
import Image from 'next/image'
import { getProduct, getProducts } from '@/lib/api'
import { GetStaticPropsContext } from 'next'
import flow from 'lodash/flow'
import tap from 'lodash/tap'
import groupBy from 'lodash/groupBy'
import chain from 'lodash/chain'
import _ from 'lodash'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

const product = {
  name: 'Zip Tote Basket',
  price: '$140',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    // More images...
  ],
  colors: [
    {
      name: 'Washed Black',
      bgColor: 'bg-gray-700',
      selectedColor: 'ring-gray-700',
    },
    { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-400' },
    {
      name: 'Washed Gray',
      bgColor: 'bg-gray-500',
      selectedColor: 'ring-gray-500',
    },
  ],
  description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
  details: [
    {
      name: 'Features',
      items: [
        'Multiple strap configurations',
        'Spacious interior with top zip',
        'Leather handle and tabs',
        'Interior dividers',
        'Stainless strap loops',
        'Double stitched construction',
        'Water-resistant',
      ],
    },
    // More sections...
  ],
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getStaticPaths = async () => {
  const response = await getProducts()
  const paths = response.map((product: ProductData) => ({
    params: { slug: `${product.id}` },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext<{ slug: string }>) => {
  const data: ProductData = await getProduct(params?.slug || '')
  return {
    props: {
      data,
      features: await serialize(data.attributes.features),
    },
    revalidate: 10,
  }
}

export const ProductSlug = ({ data, features }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  // const variants = _(data.attributes.variants.data)
  //   .map((x) => ({
  //     ...x.attributes,
  //     id: x.id,
  //   }))
  //   .groupBy((x) => x.type)
  //   .map((values, key) => {
  //     return { type: key, values: values }
  //   })
  //   .value()

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {data.attributes.images.data.map((image: ImageData) => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{image.id}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <Image
                            src={'http://localhost:1337' + image.attributes.formats.thumbnail.url}
                            alt=""
                            className="h-full w-full object-cover object-center"
                            layout="fill"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-indigo-500' : 'ring-transparent',
                            'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
              {data.attributes.images.data.map((image: ImageData) => (
                <Tab.Panel key={image.id}>
                  <Image
                    src={'http://localhost:1337' + image.attributes.url}
                    alt={image.id}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                    layout="fill"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{data.attributes.title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">{data.attributes.price}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating ? 'text-indigo-500' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: data.attributes.description,
                }}
              />
            </div>

            <form className="mt-6">
              {/*{variants.map((variant, key) => {*/}
              {/*  if (variant.type === 'color') {*/}
              {/*    return (*/}
              {/*      <div key={key}>*/}
              {/*        <h3 className="text-sm capitalize text-gray-600">{variant.type}</h3>*/}

              {/*        <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">*/}
              {/*          <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>*/}
              {/*          <div className="flex items-center space-x-3">*/}
              {/*            {variant.values.map((color) => (*/}
              {/*              <RadioGroup.Option*/}
              {/*                key={color.title}*/}
              {/*                value={color.id}*/}
              {/*                className={({ active, checked }) =>*/}
              {/*                  classNames(*/}
              {/*                    color.title,*/}
              {/*                    active && checked ? 'ring ring-offset-1' : '',*/}
              {/*                    !active && checked ? 'ring-2' : '',*/}
              {/*                    'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'*/}
              {/*                  )*/}
              {/*                }*/}
              {/*              >*/}
              {/*                <RadioGroup.Label as="p" className="sr-only">*/}
              {/*                  {color.title}*/}
              {/*                </RadioGroup.Label>*/}
              {/*                <span*/}
              {/*                  aria-hidden="true"*/}
              {/*                  style={{ backgroundColor: color.value }}*/}
              {/*                  className={classNames(*/}
              {/*                    color.value,*/}
              {/*                    'h-8 w-8 rounded-full border border-black border-opacity-10'*/}
              {/*                  )}*/}
              {/*                />*/}
              {/*              </RadioGroup.Option>*/}
              {/*            ))}*/}
              {/*          </div>*/}
              {/*        </RadioGroup>*/}
              {/*      </div>*/}
              {/*    )*/}
              {/*  }*/}
              {/*  if (variant.type === 'size') {*/}
              {/*    return (*/}
              {/*      <div className="mt-10" key={key}>*/}
              {/*        <div className="flex items-center justify-between">*/}
              {/*          <h3 className="text-sm font-medium text-gray-900">Size</h3>*/}
              {/*          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">*/}
              {/*            Size guide*/}
              {/*          </a>*/}
              {/*        </div>*/}

              {/*        <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-4">*/}
              {/*          <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>*/}
              {/*          <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">*/}
              {/*            {variant.values.map((size) => (*/}
              {/*              <RadioGroup.Option*/}
              {/*                key={size.title}*/}
              {/*                value={size.id}*/}
              {/*                className={({ active }) =>*/}
              {/*                  classNames(*/}
              {/*                    true*/}
              {/*                      ? 'cursor-pointer bg-white text-gray-900 shadow-sm'*/}
              {/*                      : 'cursor-not-allowed bg-gray-50 text-gray-200',*/}
              {/*                    active ? 'ring-2 ring-indigo-500' : '',*/}
              {/*                    'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'*/}
              {/*                  )*/}
              {/*                }*/}
              {/*              >*/}
              {/*                {({ active, checked }) => (*/}
              {/*                  <>*/}
              {/*                    <RadioGroup.Label as="p">{size.title}</RadioGroup.Label>*/}
              {/*                    {true ? (*/}
              {/*                      <div*/}
              {/*                        className={classNames(*/}
              {/*                          active ? 'border' : 'border-2',*/}
              {/*                          checked ? 'border-indigo-500' : 'border-transparent',*/}
              {/*                          'pointer-events-none absolute -inset-px rounded-md'*/}
              {/*                        )}*/}
              {/*                        aria-hidden="true"*/}
              {/*                      />*/}
              {/*                    ) : (*/}
              {/*                      <div*/}
              {/*                        aria-hidden="true"*/}
              {/*                        className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"*/}
              {/*                      >*/}
              {/*                        <svg*/}
              {/*                          className="absolute inset-0 h-full w-full stroke-2 text-gray-200"*/}
              {/*                          viewBox="0 0 100 100"*/}
              {/*                          preserveAspectRatio="none"*/}
              {/*                          stroke="currentColor"*/}
              {/*                        >*/}
              {/*                          <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />*/}
              {/*                        </svg>*/}
              {/*                      </div>*/}
              {/*                    )}*/}
              {/*                  </>*/}
              {/*                )}*/}
              {/*              </RadioGroup.Option>*/}
              {/*            ))}*/}
              {/*          </div>*/}
              {/*        </RadioGroup>*/}
              {/*      </div>*/}
              {/*    )*/}
              {/*  }*/}
              {/*})}*/}

              <div className="sm:flex-col1 mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Add to bag
                </button>

                <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md py-3 px-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                <Disclosure as="div" defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-sm font-medium')}
                          >
                            Features
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmIcon
                                className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                        <MDXRemote
                          {...features}
                          components={{
                            img: ResponsiveImage,
                          }}
                        ></MDXRemote>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

const ResponsiveImage = (props: any) => {
  return <img src={'http://localhost:1337' + props.src} alt={props.alt} />
}

export default ProductSlug
