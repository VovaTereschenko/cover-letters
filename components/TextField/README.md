# TextField Component

A flexible, accessible form field component that supports both input and textarea variants with comprehensive styling and state management.

## Features

- 🎯 **Dual Variants**: Supports both `input` and `textarea` modes
- 🎨 **Design System Integration**: Uses CSS variables for consistent theming
- ♿ **Accessibility**: Proper ARIA labels, focus management, and keyboard navigation
- 🎛️ **State Management**: Error states, disabled states, required fields
- 📱 **Responsive**: Mobile-friendly with responsive font sizes
- 🔧 **TypeScript**: Full type safety with discriminated union types
- ✅ **Tested**: Comprehensive test coverage

## Usage

### Basic Input

```tsx
<TextField
  variant="input"
  label="Job title"
  placeholder="Product manager"
  value={value}
  onChange={setValue}
/>
```

### Basic Textarea

```tsx
<TextField
  variant="textarea"
  label="Additional information"
  placeholder="Tell us about yourself"
  rows={6}
  value={value}
  onChange={setValue}
/>
```

### With Validation

```tsx
<TextField
  variant="input"
  label="Email"
  type="email"
  required
  error={hasError}
  helperText={
    hasError ? "Please enter a valid email" : "We'll never share your email"
  }
  value={email}
  onChange={setEmail}
/>
```

## Props

### Base Props (Common to both variants)

| Prop          | Type                      | Default        | Description              |
| ------------- | ------------------------- | -------------- | ------------------------ |
| `label`       | `string`                  | -              | Field label text         |
| `placeholder` | `string`                  | -              | Placeholder text         |
| `value`       | `string`                  | -              | Controlled value         |
| `onChange`    | `(value: string) => void` | -              | Value change handler     |
| `onBlur`      | `() => void`              | -              | Blur event handler       |
| `onFocus`     | `() => void`              | -              | Focus event handler      |
| `disabled`    | `boolean`                 | `false`        | Disabled state           |
| `error`       | `boolean`                 | `false`        | Error state              |
| `helperText`  | `string`                  | -              | Helper or error text     |
| `required`    | `boolean`                 | `false`        | Required field indicator |
| `id`          | `string`                  | auto-generated | Field ID                 |
| `name`        | `string`                  | -              | Field name attribute     |
| `className`   | `string`                  | -              | Additional CSS classes   |

### Input-specific Props (`variant="input"`)

| Prop   | Type                                                            | Default  | Description |
| ------ | --------------------------------------------------------------- | -------- | ----------- |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | Input type  |

### Textarea-specific Props (`variant="textarea"`)

| Prop     | Type                                             | Default      | Description            |
| -------- | ------------------------------------------------ | ------------ | ---------------------- |
| `rows`   | `number`                                         | `4`          | Number of visible rows |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize behavior        |

## Styling

The component uses CSS modules with CSS variables from the design system:

- `--color-*` for colors
- `--font-size-*` for typography
- `--font-weight-*` for font weights
- `--spacing-*` for spacing
- `--border-radius-*` for border radius
- `--shadow-*` for shadows

### CSS Classes

- `.container` - Main wrapper
- `.label` - Label styling
- `.field` - Input/textarea styling
- `.error` - Error state styling
- `.disabled` - Disabled state styling
- `.helperText` - Helper text styling
- `.errorText` - Error text styling

## Accessibility

- Proper label-input association
- ARIA attributes for error states
- Focus management and keyboard navigation
- Screen reader friendly error messages
- Color contrast compliance

## Examples

### Contact Form

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

const [errors, setErrors] = useState({});

<TextField
  variant="input"
  label="Full Name"
  required
  value={formData.name}
  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
  error={!!errors.name}
  helperText={errors.name}
/>

<TextField
  variant="input"
  label="Email"
  type="email"
  required
  value={formData.email}
  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
  error={!!errors.email}
  helperText={errors.email || "We'll never share your email"}
/>

<TextField
  variant="textarea"
  label="Message"
  rows={6}
  value={formData.message}
  onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
  placeholder="Tell us how we can help you"
/>
```

### Search Field

```tsx
<TextField
  variant="input"
  label="Search"
  placeholder="Search products..."
  value={searchTerm}
  onChange={setSearchTerm}
/>
```
