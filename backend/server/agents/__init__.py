"""
xrisk - AI Agents Package
Author: Manuel Schott

AI Agents package for xrisk application
"""

from agents.base_agent import AIAgent
from agents.validation import ValidationAgent
from agents.classification import ClassificationAgent
from agents.inquiry import InquiryAgent
from agents.research import ResearchAgent
from agents.research_current import ResearchCurrent
from agents.research_historical import ResearchHistorical
from agents.research_regulatory import ResearchRegulatory
from agents.analysis import AnalysisAgent
from agents.report import ReportAgent
from agents.combined_analysis_report import CombinedAnalysisReportAgent
from agents.model_config import ModelConfigWrapper

__all__ = [
    'AIAgent',
    'ValidationAgent',
    'ClassificationAgent',
    'InquiryAgent',
    'ResearchAgent',
    'ResearchCurrent',
    'ResearchHistorical',
    'ResearchRegulatory',
    'AnalysisAgent',
    'ReportAgent',
    'CombinedAnalysisReportAgent',
    'ModelConfigWrapper'
]
