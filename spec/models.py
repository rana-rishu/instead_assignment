"""
Instead Tax Form Annotation Specification - Python Pydantic Models & Rendering Engine
======================================================================================
This module defines the Pydantic v2 data models for the Instead tax form annotation
specification and provides a reference implementation for printing values over IRS forms.
"""

from typing import List, Optional, Union, Dict, Any, Literal
from pydantic import BaseModel, Field
import json
import re


class BoundingBox(BaseModel):
    x: float = Field(..., description="X-coordinate of the box")
    y: float = Field(..., description="Y-coordinate of the box")
    width: float = Field(..., ge=0, description="Width of the bounding box")
    height: float = Field(..., ge=0, description="Height of the bounding box")
    unit: Literal["pt", "mm", "in", "px", "percentage"] = Field("pt", description="Coordinate unit")


class DataBinding(BaseModel):
    path: str = Field(..., description="JSONPath / dot-notation expression, e.g. $.taxpayer.identity.ssn")
    fallback: Optional[str] = Field(None, description="Default fallback string if path resolves to null")
    transform: Optional[Literal[
        "NONE",
        "UPPERCASE",
        "LOWERCASE",
        "TITLE_CASE",
        "SSN_HYPHENATED",
        "SSN_UNMASKED_DIGITS",
        "SSN_MASKED_FIRST_FIVE",
        "EIN_HYPHENATED",
        "CURRENCY_NO_CENTS",
        "CURRENCY_WITH_CENTS",
        "CURRENCY_ROUND_NEAREST_DOLLAR",
        "DATE_MMDDYYYY",
        "DATE_YYYYMMDD",
        "PHONE_US",
        "BOOLEAN_TO_X",
        "BOOLEAN_TO_CHECK",
        "BOOLEAN_TO_FILLED_BOX",
        "EXTRACT_YEAR",
        "CUSTOM_EXPRESSION"
    ]] = Field("NONE", description="Transformation pipeline")
    condition: Optional[str] = Field(None, description="Boolean expression for conditional rendering")
    custom_expression: Optional[str] = Field(None, alias="customExpression")


class TypographyFormatting(BaseModel):
    font_family: str = Field("Courier", alias="fontFamily")
    font_size: float = Field(10.0, alias="fontSize")
    min_font_size: float = Field(6.0, alias="minFontSize")
    font_weight: Union[str, int] = Field("normal", alias="fontWeight")
    font_style: Literal["normal", "italic"] = Field("normal", alias="fontStyle")
    color: str = Field("#000000")
    align: Literal["left", "center", "right", "justify"] = Field("left")
    vertical_align: Literal["top", "middle", "bottom"] = Field("middle", alias="verticalAlign")
    line_height: Optional[float] = Field(None, alias="lineHeight")
    letter_spacing: Optional[float] = Field(None, alias="letterSpacing")
    overflow_strategy: Literal["shrink_to_fit", "clip", "wrap", "ellipsis"] = Field("shrink_to_fit", alias="overflowStrategy")
    text_case: Literal["none", "upper", "lower"] = Field("none", alias="textCase")


class CombBoxConfig(BaseModel):
    cell_count: int = Field(..., ge=1, alias="cellCount", description="Number of discrete character cells")
    cell_width: float = Field(..., ge=1.0, alias="cellWidth", description="Width of each sub-cell in points")
    cell_gap: float = Field(0.0, alias="cellGap", description="Gap between individual cells in points")
    groups: Optional[List[int]] = Field(None, description="Group partitions, e.g. [3, 2, 4] for SSN")
    group_gaps: Optional[List[float]] = Field(None, alias="groupGaps", description="Spacing between groups")
    delimiter: Optional[str] = Field(None, description="Delimiter between groups, e.g. '-'")
    auto_pad: Literal["left", "right", "none"] = Field("none", alias="autoPad")
    pad_char: str = Field(" ", alias="padChar")
    character_alignment: Literal["center", "left", "right"] = Field("center", alias="characterAlignment")


class CurrencyConfig(BaseModel):
    include_symbol: bool = Field(False, alias="includeSymbol")
    include_decimals: bool = Field(False, alias="includeDecimals")
    thousands_separator: str = Field(",", alias="thousandsSeparator")
    decimal_separator: str = Field(".", alias="decimalSeparator")
    negative_format: Literal["PARENTHESES", "MINUS", "TRAILING_MINUS"] = Field("PARENTHESES", alias="negativeFormat")
    zero_display: Literal["ZERO", "DASH", "BLANK"] = Field("BLANK", alias="zeroDisplay")
    cents_box_offset: Optional[float] = Field(None, alias="centsBoxOffset")


class CheckboxConfig(BaseModel):
    marker: Literal["X", "CHECK", "FILLED", "CIRCLE", "DOT"] = Field("X")
    marker_size: float = Field(10.0, alias="markerSize")
    checked_values: Optional[List[Union[str, int, bool]]] = Field(None, alias="checkedValues")
    radio_value: Optional[str] = Field(None, alias="radioValue")


class ValidationRule(BaseModel):
    required: bool = False
    regex: Optional[str] = None
    min: Optional[float] = None
    max: Optional[float] = None
    custom_rule: Optional[str] = Field(None, alias="customRule")
    error_message: Optional[str] = Field(None, alias="errorMessage")


class AuditMetadata(BaseModel):
    irs_form_ref: Optional[str] = Field(None, alias="irsFormRef")
    xml_mef_tag: Optional[str] = Field(None, alias="xmlMefTag")
    notes: Optional[str] = None
    tax_law_reference: Optional[str] = Field(None, alias="taxLawReference")


class FormFieldAnnotation(BaseModel):
    id: str
    box_number: str = Field(..., alias="boxNumber")
    label: str
    description: Optional[str] = None
    page_index: int = Field(1, ge=1, alias="pageIndex")
    category: Literal[
        "IDENTITY", "FILING_STATUS", "INCOME", "ADJUSTMENTS", "DEDUCTIONS",
        "TAX_AND_CREDITS", "PAYMENTS", "REFUND", "SIGNATURE", "PREPARER", "OTHER"
    ]
    field_type: Literal[
        "TEXT", "CURRENCY", "COMB_TEXT", "CHECKBOX", "RADIO_GROUP", "DATE",
        "SSN", "EIN", "PHONE", "BARCODE"
    ] = Field(..., alias="fieldType")
    bounds: BoundingBox
    data_binding: Optional[DataBinding] = Field(None, alias="dataBinding")
    formatting: Optional[TypographyFormatting] = None
    comb_config: Optional[CombBoxConfig] = Field(None, alias="combConfig")
    currency_config: Optional[CurrencyConfig] = Field(None, alias="currencyConfig")
    checkbox_config: Optional[CheckboxConfig] = Field(None, alias="checkboxConfig")
    validation: Optional[ValidationRule] = None
    audit: Optional[AuditMetadata] = None


class PageDimension(BaseModel):
    page_index: int = Field(1, ge=1, alias="pageIndex")
    width: float = Field(612.0)
    height: float = Field(792.0)
    unit: Literal["pt", "mm", "in", "px", "percentage"] = Field("pt")
    dpi: int = Field(72)
    origin: Literal["top-left", "bottom-left"] = Field("top-left")
    title: Optional[str] = None


class FormAnnotationSpec(BaseModel):
    spec_version: str = Field("1.0.0", alias="specVersion")
    form_id: str = Field(..., alias="formId")
    form_title: str = Field(..., alias="formTitle")
    tax_year: int = Field(..., alias="taxYear")
    revision: str
    publisher: str = Field("Internal Revenue Service (IRS)")
    description: Optional[str] = None
    pages: List[PageDimension]
    fields: List[FormFieldAnnotation]


# -----------------------------------------------------------------------------
# Deeply Nested JSONPath & Expression Resolver
# -----------------------------------------------------------------------------
def resolve_json_path(data: Any, path: str) -> Any:
    """
    Extract value from deeply nested dictionaries/lists using standard JSONPath syntax.
    Supports:
      - $.taxpayer.personalInfo.firstName
      - taxpayer.w2Forms[0].box1Wages
      - $.returns.scheduleC.expenses.office
    """
    if not path or data is None:
        return None
    
    clean_path = path.strip()
    if clean_path.startswith("$."):
        clean_path = clean_path[2:]
    elif clean_path.startswith("$"):
        clean_path = clean_path[1:]

    parts = re.split(r'\.(?![^\[]*\])', clean_path)
    curr = data

    for part in parts:
        if not part:
            continue
        # Handle array indexing e.g. w2Forms[0]
        array_match = re.match(r'^([^\[]+)\[(\d+)\]$', part)
        if array_match:
            prop_name = array_match.group(1)
            index = int(array_match.group(2))
            if isinstance(curr, dict) and prop_name in curr:
                curr = curr[prop_name]
                if isinstance(curr, list) and 0 <= index < len(curr):
                    curr = curr[index]
                else:
                    return None
            else:
                return None
        else:
            if isinstance(curr, dict) and part in curr:
                curr = curr[part]
            else:
                return None

    return curr


def format_field_value(raw_val: Any, field: FormFieldAnnotation) -> str:
    """Format extracted raw value according to field type and transform pipelines."""
    if raw_val is None:
        return field.data_binding.fallback if (field.data_binding and field.data_binding.fallback) else ""

    transform = field.data_binding.transform if field.data_binding else "NONE"
    str_val = str(raw_val)

    if transform == "UPPERCASE":
        return str_val.upper()
    elif transform == "LOWERCASE":
        return str_val.lower()
    elif transform == "TITLE_CASE":
        return str_val.title()
    elif transform == "SSN_HYPHENATED":
        digits = re.sub(r'\D', '', str_val)
        if len(digits) == 9:
            return f"{digits[:3]}-{digits[3:5]}-{digits[5:]}"
        return str_val
    elif transform == "SSN_UNMASKED_DIGITS":
        return re.sub(r'\D', '', str_val)
    elif transform == "SSN_MASKED_FIRST_FIVE":
        digits = re.sub(r'\D', '', str_val)
        if len(digits) == 9:
            return f"***-**-{digits[5:]}"
        return str_val
    elif transform == "EIN_HYPHENATED":
        digits = re.sub(r'\D', '', str_val)
        if len(digits) == 9:
            return f"{digits[:2]}-{digits[2:]}"
        return str_val
    elif transform in ("CURRENCY_NO_CENTS", "CURRENCY_ROUND_NEAREST_DOLLAR"):
        try:
            num = float(raw_val)
            rounded = round(num)
            formatted = f"{abs(rounded):,}"
            if num < 0:
                return f"({formatted})"
            return formatted
        except Exception:
            return str_val
    elif transform == "CURRENCY_WITH_CENTS":
        try:
            num = float(raw_val)
            formatted = f"{abs(num):,.2f}"
            if num < 0:
                return f"({formatted})"
            return formatted
        except Exception:
            return str_val
    elif transform == "BOOLEAN_TO_X":
        return "X" if raw_val in (True, "true", "TRUE", "yes", "YES", 1) else ""
    elif transform == "BOOLEAN_TO_CHECK":
        return "✓" if raw_val in (True, "true", "TRUE", "yes", "YES", 1) else ""

    # Field-type default formatters
    if field.field_type == "CURRENCY":
        try:
            num = float(raw_val)
            cfg = field.currency_config or CurrencyConfig()
            if num == 0 and cfg.zero_display == "BLANK":
                return ""
            include_dec = cfg.include_decimals
            formatted = f"{abs(num):,.2f}" if include_dec else f"{round(abs(num)):,}"
            if cfg.include_symbol:
                formatted = f"${formatted}"
            if num < 0:
                return f"({formatted})" if cfg.negative_format == "PARENTHESES" else f"-{formatted}"
            return formatted
        except Exception:
            return str_val

    return str_val
