"use client";

import { CVData } from "../lib/types";
import { useState } from "react";

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}
