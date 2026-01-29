import TextComponent from './content/TextComponent'
import InputComponent from './content/InputComponent'
import SelectComponent from './content/SelectComponent'
import TextareaComponent from './content/TextareaComponent'
import ButtonComponent from './content/ButtonComponent'
import UrlInputComponent from './content/UrlInputComponent'
import ImageComponent from './components/ImageComponent'
import FileUploadComponent from './components/FileUploadComponent'
import CheckboxComponent from './components/CheckboxComponent'
import RadioComponent from './components/RadioComponent'
import PaymentComponent from './content/PaymentComponent'
import HRComponent from './content/HRComponent'
import OneColumnLayout from './layout/OneColumnLayout'
import TwoColumnLayout from './layout/TwoColumnLayout'
import ThreeColumnLayout from './layout/ThreeColumnLayout'

export const CONTENT_COMPONENTS = {
  Text: { Component: TextComponent, defaultProps: { content: 'Text', tag: 'p' } },
  Input: { Component: InputComponent, defaultProps: { label: 'Input', placeholder: '', required: false, type: 'text' } },
  Select: { Component: SelectComponent, defaultProps: { label: 'Select', dataSource: '', required: false, multiselect: false } },
  Textarea: { Component: TextareaComponent, defaultProps: { label: 'Textarea', placeholder: '', required: false, rows: 3 } },
  Button: { Component: ButtonComponent, defaultProps: { label: 'Button', variant: 'primary', actionType: 'none', apiUrl: '', apiMethod: 'POST', customAction: '', validateBeforeAction: true, apiIncludeFormData: false } },
  UrlInput: { Component: UrlInputComponent, defaultProps: { label: 'URL', placeholder: 'https://' } },
  Image: { Component: ImageComponent, defaultProps: { src: '', alt: 'Image' } },
  FileUpload: { Component: FileUploadComponent, defaultProps: { label: 'Upload File', accept: '*' } },
  Checkbox: { Component: CheckboxComponent, defaultProps: { label: 'Checkbox', checked: false } },
  Radio: { Component: RadioComponent, defaultProps: { label: 'Radio', options: ['Option 1', 'Option 2'] } },
  Payment: { Component: PaymentComponent, defaultProps: { label: 'Payment details', cardNumberPlaceholder: 'Card number', expiryPlaceholder: 'MM/YY', cvvPlaceholder: 'CVV', cardholderPlaceholder: 'Cardholder name', required: false } },
  HR: { Component: HRComponent, defaultProps: {} }
}

export const LAYOUT_COMPONENTS = {
  OneColumn: { Component: OneColumnLayout, defaultProps: {}, isLayout: true },
  TwoColumn: { Component: TwoColumnLayout, defaultProps: { ratio: '50-50' }, isLayout: true },
  ThreeColumn: { Component: ThreeColumnLayout, defaultProps: {}, isLayout: true }
}

export const ALL_COMPONENTS = { ...CONTENT_COMPONENTS, ...LAYOUT_COMPONENTS }

export function getComponent(type) {
  return ALL_COMPONENTS[type]
}

export function getDefaultProps(type) {
  const meta = ALL_COMPONENTS[type]
  return meta ? { ...meta.defaultProps } : {}
}
