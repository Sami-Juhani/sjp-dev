import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { SUPPORTED_CONTENT_TYPES } from '@/constants'

export default function ContentTypeDropdown({
  setValue,
  contentType
}: ContentTypeDropdownProps) {
  return (
    <Select
      defaultValue={contentType !== undefined ? contentType.toLowerCase() : ''}
      onValueChange={value => setValue('contentType', value as ContentType)}
    >
      <SelectTrigger>
        <SelectValue placeholder='Content Type' />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_CONTENT_TYPES.map(type => (
          <SelectItem key={type} value={type.toLowerCase()}>
            {type.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
