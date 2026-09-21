package com.swinsy.web;

import com.swinsy.model.Gig;
import com.swinsy.service.GigService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final GigService gigService;

    public AdminController(GigService gigService) { this.gigService = gigService; }

    @GetMapping
    public String admin(Model model) {
        model.addAttribute("gigs", gigService.findAll());
        model.addAttribute("submissions", gigService.findAllSubmissions());
        model.addAttribute("paymentInfos", gigService.findAllPaymentInfos());
        model.addAttribute("gig", new Gig());
        return "admin";
    }

    @PostMapping("/gigs")
    public String addGig(@RequestParam String title,
                         @RequestParam String description,
                         @RequestParam BigDecimal price,
                         @RequestParam String folder,
                         @RequestParam(required = false, defaultValue = "false") boolean locked,
                         @RequestParam(required = false, defaultValue = "false") boolean paused,
                         @RequestParam(required = false) String deadline,
                         @RequestParam(required = false) MultipartFile document) {
        Gig gig = new Gig();
        gig.setTitle(title);
        gig.setDescription(description);
        gig.setPrice(price);
        gig.setFolder(folder);
        gig.setLocked(locked);
        gig.setPaused(paused);
        if (deadline != null && !deadline.isEmpty()) {
            gig.setDeadline(LocalDateTime.parse(deadline));
        }
        if (document != null && !document.isEmpty()) {
            try {
                gig.setDocumentFileName(gigService.storeDocument(document));
            } catch (Exception ignored) {}
        }
        gigService.save(gig);
        return "redirect:/admin";
    }

    @PostMapping("/gigs/{id}/delete")
    public String deleteGig(@PathVariable Long id) {
        gigService.deleteGig(id);
        return "redirect:/admin";
    }

    @PostMapping("/gigs/{id}/toggle-pause")
    public String togglePauseGig(@PathVariable Long id) {
        gigService.togglePause(id);
        return "redirect:/admin";
    }

    @PostMapping("/submissions/{id}/approve")
    public String approveSubmission(@PathVariable Long id) {
        gigService.approveSubmission(id);
        return "redirect:/admin";
    }

    @PostMapping("/submissions/{id}/reject")
    public String rejectSubmission(@PathVariable Long id) {
        gigService.rejectSubmission(id);
        return "redirect:/admin";
    }

    @PostMapping("/submissions/{id}/pay")
    public String paySubmission(@PathVariable Long id) {
        gigService.paySubmission(id);
        return "redirect:/admin";
    }
}
